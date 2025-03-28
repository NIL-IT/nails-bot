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

    function getCatalogProducts($iblockId, $iblockSectionId, $select = ['id', 'iblockId', 'name']) {
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
            'select' => ['id', 'name'],
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

}
?>