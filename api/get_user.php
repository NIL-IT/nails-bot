<?php
include 'cors.php';
include 'db.php';
header('Content-Type: application/json');

// Получаем данные POST-запроса
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data && isset($data['id_tg'])) {
    $userId = $data['id_tg'];

    try {
        // Подключение к базе данных
        $pdo = getDbConnection();

        // Проверка наличия пользователя в базе данных
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id_tg = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Пользователь найден, возвращаем его данные
            $response = [
                'success' => true,
                'user' => [
                    'id_tg' => $user['id_tg'],
                    'name' => $user['name'],
                    'admin' => $user['admin']
                ],
                'message' => 'User found'
            ];
        } else {
            $admin = false;
            // Пользователь не найден, создаём нового
            $insertStmt = $pdo->prepare("INSERT INTO users (id_tg, name, admin) VALUES (:userId, '', :admin)");
            $insertStmt->bindParam(':userId', $userId);
            $insertStmt->bindParam(':admin', $admin, PDO::PARAM_BOOL);
            $insertStmt->execute();

            // Получаем данные нового пользователя
            $newUserStmt = $pdo->prepare("SELECT * FROM users WHERE id_tg = :userId");
            $newUserStmt->bindParam(':userId', $userId);
            $newUserStmt->execute();
            $newUser = $newUserStmt->fetch(PDO::FETCH_ASSOC);

            // Возвращаем успешный ответ с информацией о новом пользователе
            $response = [
                'success' => true,
                'user' => [
                    'id_tg' => $newUser['id_tg'],
                    'name' => $newUser['name'],
                    'admin' => $newUser['admin']
                ],
                'message' => 'User created successfully'
            ];
        }

        echo json_encode($response);
    } catch (PDOException $e) {
        // Обработка ошибок базы данных
        $response = [
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ];
        echo json_encode($response);
    }
} else {
    // Ошибка, если не указаны id_tg
    $response = [
        'success' => false,
        'message' => 'Missing id_tg'
    ];
    echo json_encode($response);
}
?>
