<?php

require_once 'cors.php';

$apiUrl = "https://api.boxberry.ru/json.php";
$apiToken = "ad6fd06b28f7e8d0a94d9e0de47ce1e6";

$queryParams = [
    'token' => $apiToken,
    'method' => 'ListPoints'
];

$requestUrl = $apiUrl . '?' . http_build_query($queryParams);

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $requestUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json'
    ],
    CURLOPT_SSL_VERIFYPEER => true
]);

// Выполнение запроса
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Устанавливаем заголовок JSON
header('Content-Type: application/json; charset=utf-8');

if (curl_errno($ch)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'cURL Error: ' . curl_error($ch)
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    if ($httpCode === 200) {
        echo $response;
    } else {
        echo json_encode([
            'status' => 'error',
            'http_code' => $httpCode,
            'response' => json_decode($response, true)
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

curl_close($ch);
?>