<?php
// Указываем правильный URL для вашего API Webhook
$webhookUrl = "https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/user.current.json"; // Замените на свой URL

// Инициализация cURL
$ch = curl_init();

// Устанавливаем параметры запроса
curl_setopt($ch, CURLOPT_URL, $webhookUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json"
));

// Отправляем запрос
$response = curl_exec($ch);

// Проверяем на ошибки
if (curl_errno($ch)) {
    echo 'Ошибка cURL: ' . curl_error($ch);
} else {
    // Печатаем результат
    echo "Ответ от API: " . $response;
}

// Закрываем соединение
curl_close($ch);
?>
