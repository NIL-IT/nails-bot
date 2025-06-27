<?php

require_once __DIR__.'/../api_bitrix/CatalogBitrixRestApiClient.php';
require_once 'cors.php';

$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
} else {
    $data = $_POST;
}
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$apiClient = new CatalogBitrixRestApiClient( 'https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/' );require_once 'DatabaseClient.php';

$select = ['quantity','active','available'];

$result = $apiClient -> getCatalogProduct($data['id'], $select);
print_r($result)
?>