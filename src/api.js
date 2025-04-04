const API_URL = "https://nails.nilit2.ru:8000/catalog.php/";

export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_URL}index.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        type: "category",
        id: "NULL",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("failed:", err);
  }
};
