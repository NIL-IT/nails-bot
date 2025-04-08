<?php

class CatalogBitrixRestApiClient {
    private $apiUrl;
    private $defaultHeaders;
    function __construct($apiUrl) {
        $this->apiUrl = $apiUrl;
        $this->defaultHeaders = [
            'Content-Type: application/json',
        ];
    }

    function makeRequest($endpoint, $data = [], $method = 'POST') {
        $curl = curl_init();
        $options = [
            CURLOPT_URL => $this->apiUrl . $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => $this->defaultHeaders,
            CURLOPT_CUSTOMREQUEST => $method,
        ];

        if ($method === 'POST' && !empty($data)) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        curl_setopt_array($curl, $options);

        $response = curl_exec($curl);
        $error = curl_error($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        if ($error) {
            throw new Exception("CURL Error: " . $error);
        }
        $decodedResponse = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("JSON decode error: " . json_last_error_msg());
        }
        if ($httpCode >= 400) {
            throw new Exception("API request failed with HTTP code $httpCode", $httpCode);
        }
        return $decodedResponse;
    }

    function getCatalogProducts($iblockId, $iblockSectionId, $select = ['id', 'iblockId', 'name','detailText','purchasingPrice','xmlId']) {
        $queryData = [
            'filter' => array(
                'iblockId' => $iblockId,
                'iblockSectionId' => $iblockSectionId,
            ),
            'select' => $select
        ];
        try {
            $response = $this->makeRequest('catalog.product.list', $queryData);
            return $response['result']['products'] ?? [];
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }

    function getCatalogProduct($productId, $select = []) {
        $queryData = [
            'id' => $productId,
            'select' => $select
        ];
        try {
            $response = $this->makeRequest('catalog.product.get', $queryData);
            return $response['result']['product'] ?? [];
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }

    function getCatalogSections($iblock_id, $select = ['id', 'name']) {
        $queryData = array(
            'filter' => array(
                'iblock_id' => $iblock_id
            ),
            'select' => $select,
        );
        try {
            $response = $this->makeRequest('catalog.section.list', $queryData);
            return $response['result']['sections'] ?? [];
//            return $response;
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }
    function getCatalogSection($sectionId, $select = ['id', 'name']) {
        $queryData = array(
            'id' => $sectionId,
            'select' => $select,
        );
        try {
            $response = $this->makeRequest('catalog.section.get', $queryData);
            return $response['result']['section'] ?? [];
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }
    function getSectionsTree($iblock_id, $parentSectionId = null) {
        $queryData = [
            'filter' => array(
                'iblock_id' => $iblock_id,
                'iblockSectionId' => $parentSectionId,
            ),
            'select' => ['id', 'name','code'],
        ];
        try {
            $response = $this->makeRequest('catalog.section.list', $queryData);
            $sections = $response['result']['sections'] ?? [];
            foreach ($sections as &$section) {
                $childSections = $this->getSectionsTree($iblock_id, $section['id']);
                $section['is_last_level_depth'] = empty($childSections);
                $section['children'] = $childSections;
            }
            return $sections;
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }

    function getProductImage($productId, $select = ['id', 'type', 'detailUrl']){
        $queryData = [
            'productId' => $productId,
            'select' => $select,
        ];
        try {
            $response = $this->makeRequest('catalog.productImage.list', $queryData);
            $images = $response['result']['productImages'] ?? [];
            return $images;
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }
    function getProductPrice($productId){
        $queryData = array(
            'select' => array('id'),
            'filter' => array('productId' => $productId),
            'order' => array('id' => 'ASC'),
        );
        try {
            $response = $this->makeRequest('catalog.price.list', $queryData);
            $prices = $response['result']['prices'] ?? [];
            $priceList = [];
            foreach ($prices as $price) {
                $queryData = array(
                    'id' => $price['id'],
                );
                $result = $this->makeRequest('catalog.price.get', $queryData)['result']['price'];

                $number = $result['catalogGroupId']; // Здесь можно изменить значение переменной (1, 2, 3 или 4)
                $catalogGroupName = '';

                switch ($number) {
                    case 1:
                        $catalogGroupName = 'BASE_PRICE';
                        break;
                    case 2:
                        $catalogGroupName = 'OPT_PRICE';
                        break;
                    case 3:
                        $catalogGroupName = 'MASTER_PRICE';
                        break;
                    case 4:
                        $catalogGroupName = 'ROZNICA/MASTER_PRICE';
                        break;
                    default:
                        $catalogGroupName = 'nonePrice';
                        break;
                }
                $priceList[$catalogGroupName] = $result['price'];
            }
            $requiredKeys = [
                'BASE_PRICE',
                'OPT_PRICE',
                'MASTER_PRICE',
                'ROZNICA/MASTER_PRICE'
            ];

            foreach ($requiredKeys as $key) {
                if (!array_key_exists($key, $priceList)) {
                    $priceList[$key] = null;
                }
            }
            return $priceList ?? [];
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            return [];
        }
    }
    function getPriceType(){
        $queryData = array(
            'select' => array('id', 'name'),
        );
        $response = $this->makeRequest('catalog.priceType.list', $queryData);
        $priceTypes = $response['result'] ?? [];
        return $priceTypes;
    }

}
?>