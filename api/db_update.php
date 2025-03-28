<?php

require_once 'CatalogBitrixRestApiClient.php';
require_once 'DatabaseClient.php';

$apiClient = new CatalogBitrixRestApiClient( 'https://shtuchki.pro/rest/13283/nj2nk4gedj6wvk5j/' );

$dbClient = new DatabaseClient( 'localhost', '5432', 'testingnil6', 'ivers', '111333555Qaz' );

$iblockId = 21;
$sections = $apiClient->getSectionsTree($iblockId);

function updateSectionsTable($sections, $dbClient, $parent_id = null) {
    foreach ($sections as $section) {
        $params = [
            ':id_section' => (int)$section['id'],
            ':name' => (string)$section['name'],
            ':parent_id' => $parent_id !== null ? (int)$parent_id : null
        ];

        $query = "INSERT INTO sections (id_section, name, id_parent) 
                 VALUES (:id_section, :name, :parent_id)
                 ON CONFLICT (id_section) 
                 DO UPDATE SET
                     name = EXCLUDED.name,
                     id_parent = EXCLUDED.id_parent";

        $result = $dbClient->psqlQuery($query, $params);

        if (!empty($section['children'])) {
            updateSectionsTable($section['children'], $dbClient, $section['id']);
        }
    }
}
function setData($sections, $apiClient, $iblockId) {
    if (isset($sections[0])) {
        foreach ($sections as &$section) {
            $section = setData($section, $apiClient, $iblockId);
        }
        return $sections;
    }
    else {
        if ($sections['is_last_level_depth'] == 1) {
            $sectionWithProducts = getSectionProducts($sections, $apiClient, $iblockId);
            return $sectionWithProducts;
        }
        elseif (!empty($sections['children'])) {
            $sections['children'] = setData($sections['children'], $apiClient, $iblockId);
            return $sections;
        }
        return $sections;
    }
}

function getSectionProducts($section, $apiClient, $iblockId) {
    $products = $apiClient->getCatalogProducts($iblockId, $section['id']);

    if (!empty($products)) {
        $iter = 0;
        foreach ($products as $product) {
            if (!empty($product)) {
                $images = $apiClient->getProductImage($product['id']);

                foreach ($images as $image) {
                    $product[$image['type']] = $image['detailUrl'];
                }

                $product['parent_id'] = $section['id'];
                $products[$iter] = $product;
            }
            $iter += 1;
            usleep(1000000); // Задержка для API
        }
        $section['products'] = $products;
    } else {
        $section['products'] = [];
    }

    return $section;
}

$data = setData($sections, $apiClient, $iblockId);

function updateCatalogProductsTable($catalogData,$dbClient) {
    // Если это массив секций (верхний уровень)
    if (array_keys($catalogData) === range(0, count($catalogData) - 1)) {
        foreach ($catalogData as $section) {
            updateCatalogProductsTable($section,$dbClient);
        }
    }
    // Если это последний уровень с продуктами
    elseif (isset($catalogData['is_last_level_depth']) && $catalogData['is_last_level_depth'] == 1 && !empty($catalogData['products'])) {
        foreach ($catalogData['products'] as $product) {
            $params = [
                ':id_product' => (int)$product['id'],
                ':name' => (string)$product['name'],
                ':id_section' => $product['parent_id'] !== null ? (int)$product['parent_id'] : null,
                ':detail_picture' => $product['DETAIL_PICTURE'] !== null ? (string)$product['DETAIL_PICTURE'] : null,
                ':preview_picture' => $product['PREVIEW_PICTURE'] !== null ? (string)$product['PREVIEW_PICTURE'] : null,
            ];

            $query = "INSERT INTO catalog_products (id_product, name, id_section, detail_picture, preview_picture) 
                 VALUES (:id_product, :name, :id_section, :detail_picture, :preview_picture)
                 ON CONFLICT (id_product) 
                 DO UPDATE SET
                     name = EXCLUDED.name,
                     id_section = EXCLUDED.id_section,
                     detail_picture = EXCLUDED.detail_picture,
                     preview_picture = EXCLUDED.preview_picture
                     ";

            $result = $dbClient->psqlQuery($query, $params);
        }
    }
    elseif (!empty($catalogData['children'])) {
        updateCatalogProductsTable($catalogData['children'],$dbClient);
    }
}
updateCatalogProductsTable($data,$dbClient);
?>