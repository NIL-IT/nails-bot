<?php

$webhookUrl = 'https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/catalog.product.list';

$params = [
    'filter' => [],
    'select' => ['ID', 'IBLOCK_ID', 'NAME', 'PRICE', 'QUANTITY'], 
    'start' => 0 
];

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

$data = json_decode($response, true);
if (isset($data['result'])) {
    echo '<pre>';
    print_r($data['result']);
    echo '</pre>';
} elseif (isset($data['error'])) {
    echo 'Ошибка получения данных: ' . $data['error_description'];
} else {
    echo 'Ошибка получения данных: ' . $response;
}
?>
