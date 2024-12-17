import { del, patch, get, post } from "@/lib/httpClient";

export const getProducts = async (page, sortBy, order, tab, search) => {
  try {
    const response = await get(
      `/api/v1/products/?tab=${tab}&page=${page}&size=10&sortBy=${sortBy}&order=${order}&search=${search}`
    );
    return response;
  } catch (error) {
    console.error("Error during get products:", error);
    throw error;
  }
}
export const createProduct = (data) => {
  try {
    const response = post(`/api/v1/products`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const updateProductStatus = async (id) => {
  try {
    const response = await patch(
      `/api/v1/products/${id}/status`
    );
    return response;
  } catch (error) {
    console.error("Error during get products:", error);
    throw error;
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await del(`/api/v1/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error during get products:", error);
    throw error;
  }
};

export const uploadMainProductImage = async (file, productId) => {
  try {
    const formData = new FormData();
    formData.append("mainImage", file);

    const response = await post(`/api/v1/images/products/${productId}`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteListProductImage = async (data, productId) => {
  try {
    const response = await del(`/api/v1/images/products/${productId}/list`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadListProductImage = async (listFile, productId) => {
  try {
    console.log(listFile);
    const formData = new FormData();

    listFile.forEach(file => {
      formData.append("images", file);
    });

    const response = await post(`/api/v1/images/products/${productId}/list`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductById = (id) => {
  try {
    const response = get(`/api/v1/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const uploadMainProductVideo = async (file, productId) => {
  try {
    const formData = new FormData();
    formData.append("videoFile", file);

    const response = await post(`/api/v1/videos/products/${productId}`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = (id, data) => {
  try {
    const response = patch(`/api/v1/products/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};