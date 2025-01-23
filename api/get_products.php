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

$start = 0;
$step = 50;
$allProducts = [];

do {
    $params = [
        'filter' => ['iblockId' => 21], 
        'select' => $select, 
        'start' => $start 
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
        $allProducts = array_merge($allProducts, $data['result']);
        $start += $step;
    } else {
        break;
    }
} while (count($data['result']) > 0);

// Сохранение данных в файл
$file = fopen('products.txt', 'w');
foreach ($allProducts as $product) {
    fwrite($file, print_r($product, true) . "\n");
}
fclose($file);

echo 'Данные успешно сохранены в файл products.txt';
?>