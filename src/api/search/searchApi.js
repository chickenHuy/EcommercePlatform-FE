const { get } = require("@/lib/httpClient");

export const getSuggestions = async (keyword) => {
  try {
    const response = await get(
      `/api/v1/search/auto-suggest?keyword=${encodeURIComponent(keyword)}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCategoriesWithTreeView = async () => {
  try {
    const response = await get(`/api/v1/categories/tree-view`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBrands = async () => {
  try {
    const response = await get(`/api/v1/brands/all`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getCategory = async (id) => {
  try {
    const response = await get(`/api/v1/categories/with-id/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


