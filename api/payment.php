<?php
require_once 'cors.php';
// === УНИВЕРСАЛЬНАЯ ОБРАБОТКА ВХОДЯЩИХ ДАННЫХ ===
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Если пришёл некорректный JSON или пусто — fallback на $_POST
if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    $data = $_POST;
}

// Если всё ещё нет данных — ошибка
if (!is_array($data) || empty($data)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Пустые или некорректные входные данные',
        'raw_input' => $rawInput,
    ]);
    exit;
}

// Получаем тип операции
$type = $data['type'] ?? $_POST['type'] ?? 'init_payment';

// 📦 Настройки Tinkoff
$terminalKey = "1745407865660";
$password = 'v$0UyjFovKQX#u56';
$verifyTerminalKey = $terminalKey;
$verifyPassword = $password;

// 📁 Подключаем зависимости
require_once __DIR__ . '/../api/DatabaseClient.php';
require_once __DIR__ . '/../api_bitrix/CatalogBitrixRestApiClient.php';


// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

function generateTinkoffToken(array $data, string $password): string {
    $data = array_filter($data, fn($v) => $v !== null && $v !== '');
    $data['Password'] = $password;
    ksort($data);
    $tokenString = '';
    foreach ($data as $key => $value) {
        if ($key !== 'DATA' && $key !== 'Receipt') {
            $tokenString .= (string)$value;
        }
    }
    return hash('sha256', $tokenString);
}

function get_payment_id($order_id) {
    try {
        $dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
        $query = "SELECT payment_id FROM orders WHERE id_bitrix = :order_id LIMIT 1;";
        $params = [':order_id' => $order_id];
        $result = $dbClient->psqlQuery($query, $params);

        return $result ? json_decode($result['data'][0]['payment_id'], true) : null;
    } catch (Exception $e) {
        error_log("Error in get_payment_id: " . $e->getMessage());
        return null;
    }
}

function init_payment_on_delivery($order_id) {
    try {
        $dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
        $apiClient = new CatalogBitrixRestApiClient('https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/');
        $query = "UPDATE orders SET payment_id = :payment_id, paid = 'D' WHERE id_bitrix = :order_id";
        $params = [':order_id' => $order_id, ':payment_id' => 1];
        $updateResult = $dbClient->psqlQuery($query, $params);
        $apiClient->sale_payment_list_by_orderId($order_id);
        $apiClient->sale_shipmentitem_add($order_id);
        return [
            'status' => 'ok',
            'updated' => $updateResult
        ];
    } catch (Exception $e) {
        error_log("init_payment_on_delivery error: " . $e->getMessage());
        return ['error' => $e->getMessage()];
    }
}

function init_payment(int $amount, int $tg_user_id, int $order_id, string $terminalKey, string $password): ?array {
    $url = "https://securepay.tinkoff.ru/v2/Init";
    $orderId = "{$order_id}_{$tg_user_id}_" . time();

    $payload = [
        "TerminalKey" => $terminalKey,
        "Amount" => $amount,
        "OrderId" => $orderId,
        "Description" => "Оплата заказа",
        "SuccessURL" => "https://nails.nilit2.ru/payment?success=true&order=" . $order_id,
        "FailURL" => "https://nails.nilit2.ru/payment?success=false",
    ];
    $payload["Token"] = generateTinkoffToken($payload, $password);

    $options = [
        "http" => [
            "header" => "Content-Type: application/json",
            "method" => "POST",
            "content" => json_encode($payload),
        ],
    ];
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);

    if ($result === false) {
        error_log("Tinkoff Init API request failed");
        return null;
    }

    $response = json_decode($result, true);
    if (json_last_error() !== JSON_ERROR_NONE || !isset($response['PaymentId'])) {
        error_log("Tinkoff Init decode or format error: $result");
        return null;
    }

    try {
        $dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
        $query = "UPDATE orders SET payment_id = :payment_id WHERE id_bitrix = :order_id";
        $params = [':order_id' => $order_id, ':payment_id' => $response['PaymentId']];
        $dbClient->psqlQuery($query, $params);
    } catch (Exception $e) {
        error_log("DB error in init_payment: " . $e->getMessage());
    }

    return $response;
}

function verify_payment(string $paymentId, string $terminalKey, string $password): array {
    $url = "https://securepay.tinkoff.ru/v2/GetState";
    $payload = ["TerminalKey" => $terminalKey, "PaymentId" => $paymentId];
    $payload["Token"] = generateTinkoffToken($payload, $password);

    $options = [
        "http" => [
            "header" => "Content-Type: application/json",
            "method" => "POST",
            "content" => json_encode($payload),
        ],
    ];
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);

    if (!$result) return ["status" => "error", "message" => "Ошибка связи с Tinkoff"];

    $response = json_decode($result, true);
    if (isset($response["Success"], $response["Status"]) && $response["Success"] && $response["Status"] === "CONFIRMED") {
        $parts = explode("_", $response["OrderId"]);
        if (count($parts) < 2) return ["status" => "error", "message" => "Неверный формат OrderId"];

        $order_id = (int)$parts[0];
        $tg_user_id = (int)$parts[1];
        $amount = $response["Amount"] / 100.0;

        try {
            $apiClient = new CatalogBitrixRestApiClient('https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/');
            $dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
            $dbClient->psqlQuery("UPDATE orders SET paid = 'Y' WHERE id_bitrix = :order_id", [':order_id' => $order_id]);
            $paymentId = $apiClient->sale_payment_list_by_orderId($order_id);
            $apiClient->sale_payment_update_paid($paymentId, $amount);
            $apiClient->sale_shipmentitem_add($order_id);

            return [
                "status" => "ok",
                "message" => "Платёж подтверждён",
                "amount" => $amount,
                "order_id" => $order_id,
                "tg_user_id" => $tg_user_id,
                "payment_id" => $paymentId,
                "tinkoff_response" => $response
            ];
        } catch (Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    return ["status" => "failed", "message" => "Платёж не подтверждён", "tinkoff_response" => $response];
}

// === РОУТИНГ ===

switch ($type) {
    case 'init_payment':
        foreach (['amount', 'id_tg_user', 'order_id'] as $key) {
            if (empty($data[$key])) {
                echo json_encode(['status' => 'error', 'message' => "Отсутствует поле: $key"]);
                exit;
            }
        }
        $response = init_payment((int)$data['amount'], (int)$data['id_tg_user'], (int)$data['order_id'], $terminalKey, $password);
        echo json_encode($response ? [
            'status' => 'ok',
            'payment_url' => $response['PaymentURL'] ?? '',
            'order_id' => $response['OrderId'] ?? '',
            'payment_id' => $response['PaymentId'] ?? '',
            'response' => $response
        ] : ['status' => 'error', 'message' => 'Не удалось инициировать платёж']);
        break;

    case 'verify_payment':
        if (empty($data['payment_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Не передан payment_id']);
            exit;
        }
        echo json_encode(verify_payment($data['payment_id'], $verifyTerminalKey, $verifyPassword));
        break;

    case 'get_payment_id':
        if (empty($data['order_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Не передан order_id']);
            exit;
        }
        echo json_encode(get_payment_id($data['order_id']));
        break;

    case 'init_payment_on_delivery':
        error_log("🔥 init_payment_on_delivery called with order_id:" . $data['order_id']);
        if (empty($data['order_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Не передан order_id']);
            exit;
        }
        echo json_encode(init_payment_on_delivery((int)$data['order_id']));
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Неизвестный тип операции']);
}
