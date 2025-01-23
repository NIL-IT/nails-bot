<?php

$webhookUrl = 'https://shtuchki.pro/rest/68/zhc69jnwgx6hweyj/catalog.product.list';
$select = [
    'id',
    'iblockId',
    'name',
    'price',
    'detailText',
    'detailPicture',
    'purchasingPrice',
    
];

$params = [
    'filter' => ['iblockId' => 21], 
    'select' => $select, 
    'start' => 30450 
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhookUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);


$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if (isset($data['result'])) {
    echo '<pre>';
    print_r($data['result']);
    echo '</pre>';
} elseif (isset($data['error'])) {
    echo 'Ошибка получения   данных: ' . $data['error_description'];
} else {
    echo 'Ошибка получения данных: ' . $response;
}
?>