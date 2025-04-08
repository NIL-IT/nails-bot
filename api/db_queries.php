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
};
function get_catalog($dbClient): array {
    $query = "
        WITH RECURSIVE section_tree AS (
            SELECT 
                id_section,
                id_parent,
                id,
                name,
                picture,
                detail_picture,
                1 AS level
            FROM sections
            WHERE id_parent IS NULL
            
            UNION ALL
            
            SELECT 
                s.id_section,
                s.id_parent,
                s.id,
                s.name,
                s.picture,
                s.detail_picture,
                st.level + 1 AS level
            FROM sections s
            INNER JOIN section_tree st ON s.id_parent = st.id_section
        )
        SELECT * FROM section_tree
        ORDER BY level;
    ";

    $result = $dbClient->psqlQuery($query);
    return is_array($result) ? $result : [];
}

function seachProduct($search,$dbClient){
    $params = [':search' => "%".(string)$search."%",];
    $query = "
    SELECT *
    FROM catalog_products
    WHERE name ILIKE :search;
    ";

    $result = $dbClient->psqlQuery($query,$params);
    return is_array($result) ? $result : [];
}
?>
