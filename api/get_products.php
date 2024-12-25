<?php
// Адрес вашего REST вебхука
$webhookUrl = 'https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/profile/';

// Задаем параметры для запроса (если нужно)
$params = [
    // Укажите необходимые параметры для вашего метода, если они требуются
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
?>
