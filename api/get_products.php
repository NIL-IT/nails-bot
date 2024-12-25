<?php
// Адрес вашего REST вебхука
$webhookUrl = 'https://shtuchki.pro/rest/1/sjjsknt6sbp1ga92hh8z9ki1naw25ki6';

// Вызов метода для получения списка товаров
$response = file_get_contents($webhookUrl . '/crm.product.list');
$products = json_decode($response, true);

if (isset($products['result'])) {
    echo '<pre>';
    print_r($products['result']);
    echo '</pre>';
} else {
    echo 'Ошибка получения данных';
}
