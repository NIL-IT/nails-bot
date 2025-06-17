<?php

function getDbConnection() {
    $host = "localhost"; 
    $port = "5432"; 
    $dbname = "testingnil6"; 
    $user = "ivers"; 
    $password = "111333555Qaz"; 
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    
    try {
        $pdo = new PDO($dsn, $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]);
        exit;
    }
}
?>