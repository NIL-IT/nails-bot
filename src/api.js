// API.js - Enhanced version
const baseURL = "https://nails.nilit2.ru:8000/";

export const API = {
  // Existing methods
  getUser: async (id_tg) => {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_tg }),
    };

    return fetch(`${baseURL}get_user.php`, option)
      .then((res) => res.json())
      .catch((err) => {
        console.error("API request error:", err);
        return { success: false };
      });
  },

  // Helper function to parse JSON response that might contain multiple JSON objects
  parseResponse: async (response) => {
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      // If single JSON parse fails, try splitting multiple JSON objects
      const jsonParts = responseText.split("}{");
      if (jsonParts.length > 1) {
        // Fix the split objects by adding the missing braces
        const dataJson = jsonParts[0] + "}" + "{" + jsonParts[1];
        try {
          return JSON.parse(dataJson);
        } catch (e) {
          // If that fails, try just the second part
          const secondPart = "{" + jsonParts[1];
          return JSON.parse(secondPart);
        }
      }
      // console.error("Unable to parse response data:", responseText);
      // throw new Error("Unable to parse response data");
    }
  },

  // Get all categories
  getCategories: async () => {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "catalog",
        id: "NULL",
      }),
    };

    try {
      const resp = await fetch(`${baseURL}catalog.php`, option);
      return API.parseResponse(resp);
    } catch (err) {
      console.error("API request error:", err);
      return { data: [] };
    }
  },

  // Get single product by id
  getProduct: async (productId) => {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "item",
        id: productId,
      }),
    };

    try {
      const resp = await fetch(`${baseURL}catalog.php`, option);
      return API.parseResponse(resp);
    } catch (err) {
      console.error("API request error:", err);
      return { success: false };
    }
  },

  // Получение заказов пользователя
  getOrders: async (userId) => {
    const option = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return fetch(`${baseURL}get_orders.php?user_id=${userId}`, option)
      .then((res) => res.json())
      .catch((err) => {
        console.error("API request error:", err);
        return [];
      });
  },
};

// Recursive function to fetch subcategories and products
async function transformCatalogWithProducts(catalogData) {
  // Function to recursively process the tree
  async function processNode(node) {
    // Create a new node that preserves the original structure
    const newNode = { ...node };

    // If node has level 3 or 4 (subcategory that should contain products)
    if (node.children === undefined) {
      try {
        // Fetch product details using the provided API function
        const productData = await API.getProduct(node.id);

        // Replace the children array with product data
        if (
          productData.data &&
          Array.isArray(productData.data) &&
          productData.data.length > 0
        ) {
          newNode.children = productData.data[0];
        } else {
          newNode.children = []; // Empty array if no products
        }

        return newNode;
      } catch (error) {
        // console.error(`Error fetching products for ${node.id}:`, error);
        newNode.children = []; // Set empty array on error
        return newNode;
      }
    }

    // For nodes with level 1 or 2 (main categories), process their children
    if (
      node.children &&
      Array.isArray(node.children) &&
      node.children.length > 0
    ) {
      // Process all children and wait for all promises to resolve
      newNode.children = await Promise.all(
        node.children.map((child) => processNode(child))
      );
    }

    return newNode;
  }

  // Start processing with the root data
  if (Array.isArray(catalogData)) {
    // If catalogData is an array, process each item
    return await Promise.all(catalogData.map((item) => processNode(item)));
  } else {
    // If catalogData is a single object
    return await processNode(catalogData);
  }
}

export async function getAllProducts(catalogData) {
  try {
    // Проверка входных данных
    if (!catalogData || !Array.isArray(catalogData)) {
      throw new Error("Invalid catalog data");
    }

    // Добавьте логирование для отладки
    console.log("Processing categories:", catalogData.length);
    const transformed = await transformCatalogWithProducts(catalogData);
    console.log("Transformed data:", transformed);
    return transformed;
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return []; // Возвращаем fallback-значение
  }
}
