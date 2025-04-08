<?php
require_once __DIR__.'/../api/DatabaseClient.php';

$dbClient = new DatabaseClient( 'localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz' );

$query = "

";

$result = $dbClient -> psqlQuery($query);
print_r($result);
?>