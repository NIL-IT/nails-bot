<?php

require_once 'DatabaseClient.php';
$dbClient = new DatabaseClient('localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz');
$query = "
CREATE TABLE user_to_cart (
    user_id INTEGER NOT NULL,
    cart_id INTEGER NOT NULL,
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, cart_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);
";

$result = $dbClient->psqlQuery($query);
print_r($result);
?>