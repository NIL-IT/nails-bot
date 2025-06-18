<?php
require_once __DIR__.'/../api/DatabaseClient.php';
require_once __DIR__.'/../api_bitrix/CatalogBitrixRestApiClient.php';
require_once 'cors.php';

header('Content-Type: application/json');

$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
$data = (strpos($contentType, 'application/json') !== false)
    ? json_decode(file_get_contents('php://input'), true)
    : $_POST;

$type = $data['type'] ?? 'init_payment';

$terminalKey = "1745407865660";
$password = 'v$0UyjFovKQX#u56';

$verifyTerminalKey = "1745407865660";
$verifyPassword = 'v$0UyjFovKQX#u56';


//$terminalKey = "1745407865610DEMO";
//$password = 'nT9DjqiwgtAmbwr0';
//
//$verifyTerminalKey = "1745407865610DEMO";
//$verifyPassword = 'nT9DjqiwgtAmbwr0';
// === Генерация токена ===
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

        if (!$result) {
            return null;
        }
        return json_decode($result['data'][0]['payment_id'],true);

    } catch (Exception $e) {
        error_log("Error in get_payment_id: " . $e->getMessage());
        return null;
    }
}
function init_payment_on_delivery($order_id) {
    try {
        $dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
        $apiClient = new CatalogBitrixRestApiClient( 'https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/' );
        $query = "UPDATE orders 
            SET 
                payment_id = :payment_id,
                paid = 'ON_DELIVERY'
            WHERE 
                id_bitrix = :order_id";
        $params = [
            ':order_id' => $order_id,
            ':payment_id' => 1,
        ];
        $result = $dbClient->psqlQuery($query, $params);
        $result['sale_payment_list_by_orderId'] = $apiClient -> sale_payment_list_by_orderId($order_id);
        $result['sale_shipmentitem_add'] = $apiClient -> sale_shipmentitem_add($order_id);
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
    }

    return $result;
}
// === Инициализация платежа ===
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
        error_log("Tinkoff API request failed");
        return null;
    }

    $response = json_decode($result, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        return null;
    }

    if (!$response || !isset($response['PaymentId'])) {
        error_log("Tinkoff API error: " . $result);
        return null;
    }

    // Обновляем payment_id в БД
    try {
        $dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
        $query = "UPDATE orders SET payment_id = :payment_id WHERE id_bitrix = :order_id";
        $params = [
            ':order_id' => $order_id,
            ':payment_id' => $response['PaymentId'],
        ];
        $dbClient->psqlQuery($query, $params);
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
    }

    return $response;
}

// === Проверка платежа ===
function verify_payment(string $paymentId, string $terminalKey, string $password): array {
    $url = "https://securepay.tinkoff.ru/v2/GetState";

    $payload = [
        "TerminalKey" => $terminalKey,
        "PaymentId"   => $paymentId,
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
    $result = file_get_contents($url, false, $context);

    if (!$result) {
        return ["status" => "error", "message" => "Ошибка связи с Tinkoff"];
    }

    $response = json_decode($result, true);

    if (isset($response["Success"]) && $response["Success"] && $response["Status"] === "CONFIRMED") {
        $orderId = $response["OrderId"];
        $amount = $response["Amount"] / 100.0;
//        $amount = 100.0 / 100.0;

        $parts = explode("_", $orderId);
        if (count($parts) < 2) {
            return ["status" => "error", "message" => "Неверный формат OrderId"];
        }

        $order_id = (int)$parts[0];
        $tg_user_id = (int)$parts[1];

        $apiClient = new CatalogBitrixRestApiClient( 'https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/' );

        $dbClient = new DatabaseClient( 'localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz' );
        $query = "
            UPDATE orders
            SET paid = 'Y'
            WHERE id_bitrix = :order_id;
        ";
        $params = array(':order_id' => $order_id);
        $result = $dbClient->psqlQuery($query, $params);
        $dbClient -> psqlQuery($query, $params);
        $paymentId = $apiClient -> sale_payment_list_by_orderId($order_id);
        $apiClient -> sale_payment_update_paid($paymentId,$amount);
        $apiClient -> sale_shipmentitem_add($order_id);
        return [
            "status" => "ok",
            "message" => "Платёж подтверждён",
            "amount" => $amount,
            "order_id" => $order_id,
            "tg_user_id" => $tg_user_id,
            "payment_id" => $paymentId,
            "tinkoff_response" => $response

        ];
    }

    return ["status" => "failed", "message" => "Платёж не подтверждён", "tinkoff_response" => $response];
}

// === Роутинг ===
if ($type === 'init_payment') {
    $requiredFields = [
        'amount' => 'Не указано поле (amount)',
        'id_tg_user' => 'Не указан телеграмм id пользователя (id_tg_user)',
        'order_id' => 'Не указан номер заказа (order_id)'
    ];

    foreach ($requiredFields as $key => $errorMessage) {
        if (!isset($data[$key])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $errorMessage]);
            exit;
        }
    }

    $amount = (int) $data['amount'];
    $tg_user_id = (int) $data['id_tg_user'];
    $order_id = (int) $data['order_id'];

    $response = init_payment($amount, $tg_user_id, $order_id, $terminalKey, $password);

    if (!$response || !isset($response['PaymentURL'])) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Не удалось инициировать платёж', 'response' => $response]);
    } else {
        echo json_encode([
            'status' => 'ok',
            'payment_url' => $response['PaymentURL'],
            'order_id' => $response['OrderId'] ?? '',
            'payment_id' => $response['PaymentId'] ?? '',
            'response' => $response ?? ''
        ]);
    }

} elseif ($type === 'verify_payment') {
    if (!isset($data['payment_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Не передан payment_id']);
        exit;
    }

    $paymentId = $data['payment_id'];
    $verifyResponse = verify_payment($paymentId, $verifyTerminalKey, $verifyPassword);
    echo json_encode($verifyResponse);
} elseif ($type === 'get_payment_id') {
    if (!isset($data['order_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Не передан order_id']);
        exit;
    }

    $order_id = $data['order_id'];
    $response = get_payment_id($order_id);
    echo json_encode($response);
} elseif ($type === 'init_payment_on_delivery') {
    if (!isset($data['order_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Не передан order_id']);
        exit;
    }

    $order_id = $data['order_id'];
    $response = init_payment_on_delivery($order_id);
    echo json_encode($response);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Неизвестный тип операции']);
}
