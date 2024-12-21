<?php
// Укажите ваш вебхук Bitrix24 и метод API
define('BITRIX_WEBHOOK_URL', 'https://your-bitrix24-domain.bitrix24.ru/rest/1/your-webhook-token/');

// Функция для отправки запросов к API Bitrix24
function callBitrix24API($method, $params = []) {
    $url = BITRIX_WEBHOOK_URL . $method;

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($params),
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($curl);
    curl_close($curl);

    return json_decode($response, true);
}

// Параметры запроса для получения списка товаров
$params = [
    'select' => ['ID', 'NAME', 'PRICE'], // Поля, которые хотите получить
    'filter' => [], // Фильтр, если нужно (например, 'ACTIVE' => 'Y')
    'order' => ['ID' => 'ASC'], // Сортировка
    'start' => 0 // Пагинация (начальный элемент)
];

// Вызов метода catalog.catalog.list
$response = callBitrix24API('catalog.catalog.list', $params);

// Проверка и вывод данных
if (isset($response['result']) && !empty($response['result'])) {
    echo "<h1>Список товаров</h1>";
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Название</th><th>Цена</th></tr>";

    foreach ($response['result'] as $item) {
        echo "<tr>";
        echo "<td>{$item['ID']}</td>";
        echo "<td>{$item['NAME']}</td>";
        echo "<td>{$item['PRICE']}</td>";
        echo "</tr>";
    }

    echo "</table>";
} else {
    echo "<p>Нет доступных данных или произошла ошибка</p>";
    if (isset($response['error_description'])) {
        echo "<p>Ошибка: {$response['error_description']}</p>";
    }
}
?>