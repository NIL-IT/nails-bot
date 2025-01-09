<?php
// Адрес вашего REST вебхука с указанием метода
$webhookUrl = 'https://shtuchki.pro/rest/13283/hrwfpr2yee7qvk2f/catalog.product.list';

// Задаем параметры для фильтрации и выбора полей
$params = [
    'filter' => [],
    'select' => ['ID', 'IBLOCK_ID', 'NAME', 'PRICE', 'QUANTITY'], // Обязательные и дополнительные поля
    'start' => 0 // Для постраничной загрузки, если много данных
];
//
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
} elseif (isset($data['error'])) {
    echo 'Ошибка получения данных: ' . $data['error_description'];
} else {
    echo 'Ошибка получения данных: ' . $response;
}
?>
