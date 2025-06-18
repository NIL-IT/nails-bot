<?php
$url = 'https://nails.nilit2.ru/payment.php';
$data = [
    'type' => 'init_payment_on_delivery',
    'order_id' => 5835,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Отключить проверку SSL (только для тестов!)
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);  // Отключить проверку хоста (только для тестов!)

$response = curl_exec($ch);

if (curl_errno($ch)) {
    die('Ошибка cURL: ' . curl_error($ch));
}

curl_close($ch);

echo $response;
?>