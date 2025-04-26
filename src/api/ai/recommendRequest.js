export const getRecommendListProduct = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/ai/recommend/list_product?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during getRecommendListProduct: ", error);
    throw error;
  }
};

export const getRecommendProduct = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/ai/recommend/product?product_id=${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during getRecommendProduct: ", error);
    throw error;
  }
};
