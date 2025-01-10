<?php

$webhookUrl = 'https://shtuchki.pro/rest/68/zhc69jnwgx6hweyj/catalog.product.list';

$params = [
    'filter' => ['iblockId' => 21], 
    'select' => ['id', 'iblockId', 'name', 'price', 'QUANTITY'], 
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
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_USERPWD, 'wizzardhtt@gmail.com:111222'); // Логин и пароль

    $response = curl_exec($ch);
    curl_close($ch);

    // Обрабатываем ответ
    $data = json_decode($response, true);
    if (isset($data['result'])) {
        $allProducts = array_merge($allProducts, $data['result']);
        $params['start'] += count($data['result']);
    } elseif (isset($data['error'])) {
        echo 'Ошибка получения данных: ' . $data['error_description'];
        break;
    } else {
        echo 'Ошибка получения данных: ' . $response;
        break;
    }
} while (count($data['result']) > 0);

echo '<pre>';
print_r($allProducts);
echo '</pre>';
?>