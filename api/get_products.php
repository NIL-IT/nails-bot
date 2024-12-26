<?php
// Адрес REST API
$webhookUrl = 'https://shtuchki.pro/rest/13283/zhc69jnwgx6hweyj/profile/';

// Инициализация cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhookUrl); // URL запроса
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);

// Выполнение GET-запроса
$response = curl_exec($ch);

// Проверка на ошибки
if (curl_errno($ch)) {
    echo 'Ошибка cURL: ' . curl_error($ch);
} else {
    $data = json_decode($response, true);
    if (isset($data['result'])) {
        echo '<pre>';
        print_r($data['result']);
        echo '</pre>';
    } else {
        echo 'Ошибка получения данных: ' . $response;
    }
}

// Закрытие cURL
curl_close($ch);
?>