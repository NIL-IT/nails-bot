<?php
// Адрес вашего REST вебхука
$webhookUrl = 'https://shtuchki.pro/rest/1/sjjsknt6sbp1ga92hh8z9ki1naw25ki6';

// Задаем параметры для фильтрации (если нужно)
$params = [
    'filter' => [], // Фильтры, например ['ACTIVE' => 'Y']
    'select' => ['ID', 'NAME', 'PRICE', 'QUANTITY'], // Поля, которые хотите получить
    'start' => 0 // Для постраничной загрузки
];

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
    echo '<pre>';
    print_r($data['result']);
    echo '</pre>';
} else {
    echo 'Ошибка получения данных: ' . $response;
}
