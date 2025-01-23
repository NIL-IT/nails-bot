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

$step = 50;
$startFile = '/var/www/testingnil6/backend/api/start.txt';
$productFile = '/var/www/testingnil6/backend/api/products.txt';

// Чтение значения start из файла
if (file_exists($startFile)) {
    $start = (int)file_get_contents($startFile);
} else {
    $start = 0;
}

$file = fopen($productFile, 'a');

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
        foreach ($data['result'] as $product) {
            fwrite($file, print_r($product, true) . "\n");
        }
        $start += $step;
        // Сохранение текущего значения start в файл
        file_put_contents($startFile, $start);
    } else {
        break;
    }
} while (count($data['result']) > 0);

fclose($file);

echo 'Данные успешно сохранены в файл products.txt';
?>