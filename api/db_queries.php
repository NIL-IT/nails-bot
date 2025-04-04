<?php
function get_by_id_parent($id_parent,$dbClient){
    if ($id_parent == 'NULL'){
        $query = "SELECT * 
        FROM sections
        WHERE id_parent IS NULL";
    }
    elseif (!is_numeric($id_parent)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id']);
        return;
    }
    else{
        $query = "SELECT * 
        FROM sections
        WHERE id_parent = ".$id_parent;
    }
    $result = $dbClient->psqlQuery($query);
    $data = $result['data'];
    if (isset($data) and empty($data)) {
        $query = "SELECT id 
        FROM catalog_products
        WHERE id_section = ".$id_parent;
        $result = $dbClient->psqlQuery($query);
        $data = $result['data'];
        return $data;
    }
    elseif (isset($data) and !empty($data)) {
        return $data;
    }
    else{
        return 'query error';
    }
}
function get_by_id_product($id_product,$dbClient)
{

    if (is_numeric($id_product)) {
        $query = "SELECT *
        FROM catalog_products Where id = " . $id_product;
        $result = $dbClient->psqlQuery($query);
        $data = $result['data'];
        if (isset($data) and !empty($data)) {
            return $data;
        } else {
            echo 'query error';
        }
    }
    else{
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id']);
        return;
    }
}