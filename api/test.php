<?php
require_once __DIR__.'/../api/DatabaseClient.php';
require_once __DIR__.'/../api_bitrix/CatalogBitrixRestApiClient.php';
$apiClient = new CatalogBitrixRestApiClient( 'https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/' );
//$paymentId =
//print_r($apiClient -> sale_payment_add(5388,24));
print_r($apiClient ->sale_basketitem_add(5388,12407,1, 270,'Мешок для пылесоса MAX ULTIMATE 1 шт'));
//print_r($apiClient -> sale_payment_update_paid($paymentId,120));