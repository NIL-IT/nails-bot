<?php
include 'cors.php';
$webhookUrl = 'https://shtuchki.pro/rest/68/zhc69jnwgx6hweyj/profile/';


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhookUrl); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);


$response = curl_exec($ch);


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


curl_close($ch);
?>