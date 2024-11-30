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
};

export const getCategory = async (id) => {
  try {
    const response = await get(`/api/v1/categories/with-id/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async ({
  categories,
  brands,
  minPrice,
  maxPrice,
  search,
  rating,
  store,
  sortBy,
  order,
  page = 1,
  limit,}
) => {
  try {
    // Xây dựng query string
    const queryParams = new URLSearchParams();

    if (categories && categories.length > 0) {
      queryParams.append("categories", categories.join(","));
    }
    if (brands && brands.length > 0) {
      queryParams.append("brands", brands.join(","));
    }
    if (store) {
      queryParams.append("store", store);
    }
    if (sortBy) {
      queryParams.append("sortBy", sortBy);
    }
    if (order) {
      queryParams.append("order", order);
    }
    if (minPrice !== undefined) {
      queryParams.append("minPrice", minPrice);
    }
    if (maxPrice !== undefined) {
      queryParams.append("maxPrice", maxPrice);
    }
    if (search) {
      queryParams.append("search", search);
    }
    if (rating !== undefined) {
      queryParams.append("rating", rating);
    }
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    console.log(queryParams.toString())

    const response = await get(`/api/v1/search?${queryParams.toString()}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getStore = async (id) => {
  try {
    const response = await get(`/api/v1/stores/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductTop3 = async (id) => {
  try {
    const response = await get(`/api/v1/products/top3/store/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};