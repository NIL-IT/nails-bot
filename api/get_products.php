<?php
// Адрес вашего REST вебхука
$webhookUrl = 'https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/profile/';

// Инициализация cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhookUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// Выполнение GET-запроса
$response = curl_exec($ch);
curl_close($ch);

// Обработка ответа
$data = json_decode($response, true);
if (isset($data['result'])) {
    echo '<pre>';
    print_r($data['result']);
    echo '</pre>';
} else {
    echo 'Ошибка получения данных: ' . $response;
}
?>