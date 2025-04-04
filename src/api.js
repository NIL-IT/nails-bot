const API_URL = "https://nails.nilit2.ru:8000/catalog.php";

async function makeRequest(requestData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // First check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Try to parse as JSON, but handle text response
    const text = await response.text();
    if (text === "query error") {
      throw new Error("Database query error");
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${text}`);
    }
  } catch (error) {
    throw error;
  }
}

export async function getRootCategories() {
  return makeRequest({
    type: "category",
    id: "NULL",
  });
}

export async function getCategoryContents(categoryId) {
  return makeRequest({
    type: "category",
    id: categoryId,
  });
}

export async function getItemDetails(itemId) {
  return makeRequest({
    type: "item",
    id: itemId,
  });
}

/**
 * Example usage:
 *
 * import { getRootCategories, getCategoryContents, getItemDetails } from './catalogApi';
 *
 * // Get root categories
 * getRootCategories()
 *   .then(data => console.log('Root categories:', data))
 *   .catch(error => console.error('Error getting root categories:', error));
 *
 * // Get subcategories or items of category with ID 5
 * getCategoryContents(5)
 *   .then(data => console.log('Category contents:', data))
 *   .catch(error => console.error('Error getting category contents:', error));
 *
 * // Get details of item with ID 10
 * getItemDetails(10)
 *   .then(data => console.log('Item details:', data))
 *   .catch(error => console.error('Error getting item details:', error));
 */
