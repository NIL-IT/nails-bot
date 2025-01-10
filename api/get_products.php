<?php

$webhookUrl = 'https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/crm.product.list';

$params = [
    'filter' => [],
    'select' => ['ID', 'NAME', 'PRICE', 'QUANTITY'], 
    'start' => 0 
];

$allProducts = [];
do {
    // Выполняем запрос
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $webhookUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $response = curl_exec($ch);
    curl_close($ch);

    // Обрабатываем ответ
    $data = json_decode($response, true);
    if (isset($data['result'])) {
        $allProducts = array_merge($allProducts, $data['result']);
        $params['start'] += count($data['result']);
    } elseif (isset($data['error'])) {
        if ($data['error'] === 'authorization_error') {
            echo 'Ошибка авторизации: ' . $data['error_description'];
            break;
        } else {
            echo 'Ошибка получения данных: ' . $data['error_description'];
            break;
        }
    } else {
        echo 'Ошибка получения данных: ' . $response;
        break;
    }
} while (count($data['result']) > 0);

echo '<pre>';
print_r($allProducts);
echo '</pre>';
?>
