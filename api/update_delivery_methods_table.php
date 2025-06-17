<?php

require_once __DIR__.'/../api_bitrix/CatalogBitrixRestApiClient.php';
require_once 'DatabaseClient.php';
require_once 'db_queries.php';

$apiClient = new CatalogBitrixRestApiClient( 'https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/' );
$dbClient = new DatabaseClient( 'localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz' );

$shipments = $apiClient -> sale_delivery_list();

print_r($shipments);