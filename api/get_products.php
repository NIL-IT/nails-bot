<?php
// Адрес вашего REST вебхука
$webhookUrl = 'https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/profile/catalog.product.get';

// Данные запроса
$queryData = http_build_query(array(
    "id" => 1111, // ID товара
    "fields" => array(
        "ID",
        "NAME",
        "PRICE",
        "QUANTITY",
        "DETAIL_PICTURE"
    )
));

// Инициализация cURL
$curl = curl_init();

// Устанавливаем параметры запроса
curl_setopt_array($curl, array(
    CURLOPT_SSL_VERIFYPEER  => 0,
    CURLOPT_POST            => 1,
    CURLOPT_HEADER          => 0,
    CURLOPT_RETURNTRANSFER  => 1,
    CURLOPT_URL             => $webhookUrl,
    CURLOPT_POSTFIELDS      => $queryData,
));

// Отправляем запрос
$result = curl_exec($curl);

// Проверяем на ошибки
if (curl_errno($curl)) {
    echo 'Ошибка cURL: ' . curl_error($curl);
} else {
    // Обрабатываем результат
    $result = json_decode($result, true);
    if (isset($result['result']['product']['detailPicture']['url'])) {
        $result['result']['product']['detailPicture']['url'] = str_replace('/rest/', $webhookUrl, $result['result']['product']['detailPicture']['url']);
    }
    echo '<pre>';
    print_r($result);
    echo '</pre>';
}

// Закрываем соединение
curl_close($curl);
?>