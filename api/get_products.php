<?php
$webhookUrl = 'https://shtuchki.pro/rest/68/zhc69jnwgx6hweyj/profile/';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhookUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
]);;
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

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
