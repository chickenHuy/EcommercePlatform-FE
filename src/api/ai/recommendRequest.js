export const getRecommendListProduct = async (userId, currentPage, pageSize, limitAll, limitUser, limitOne) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/recommend/list_product?user_id=${userId}&page=${currentPage}&size=${pageSize}&limit_all=${limitAll}&limit_user=${limitUser}&limit_one=${limitOne}`,
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

export const getRecommendProduct = async (productId, currentPage, pageSize, limitAll) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/recommend/product?product_id=${productId}&page=${currentPage}&size=${pageSize}&limit_all=${limitAll}`,
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
