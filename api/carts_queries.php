<?php

require_once 'DatabaseClient.php';
$dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
$query = "
ALTER TABLE catalog_products 
ADD CONSTRAINT catalog_products_id_product_unique UNIQUE (id_product);
";

$result = $dbClient->psqlQuery($query);
print_r($result);
?>