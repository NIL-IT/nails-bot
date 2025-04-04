<?php
require_once 'DatabaseClient.php';
require_once 'db_queries.php';

$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
} else {
    $data = $_POST;
}
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['type'], $data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing type or id']);
    exit;
}

$type = $data['type'];
$id = $data['id'];

$dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');

switch ($type) {
    case 'category':
        $result = get_by_id_parent($id,$dbClient); // твоя функция
        break;

    case 'item':
        $result = get_by_id_product($id,$dbClient);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
        exit;
}

echo json_encode(['data' => $result]);

?>