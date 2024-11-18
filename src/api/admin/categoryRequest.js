import { del, get, post, put } from "@/lib/httpClient";

export const getAllCategory = (page, sortType, search = "") => {
  try {
    const response = get(
      `/api/v1/categories?page=${page}&size=8&sort=${sortType}&search=${search}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getAll = () => {
  try {
    const response = get(`/api/v1/categories/all`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getCategoryBySlug = (categorySlug) => {
  try {
    const response = get(`/api/v1/categories/${categorySlug}`);
    console.log("Category by ID:", response);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const createCategory = (data) => {
  try {
    const response = post(`/api/v1/categories`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const updateCategory = (categoryId, data) => {
  try {
    const response = put(`/api/v1/categories/${categoryId}`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await del(`/api/v1/categories/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error during deleting categories:", error);
    throw error;
  }
};

export const addComponentByCategoryId = (categoryId, data) => {
  try {
    const response = put(`/api/v1/categories/${categoryId}/components`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getAllComponent = () => {
  try {
    const response = get(`/api/v1/components`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const uploadCategoryImage = async (id, file) => {
  try {
    console.log("file: ", file);
    const formData = new FormData();
    formData.append("image", file);
    console.log("formData: ", formData);

    const response = await post(`/api/v1/images/categories/${id}`, formData);
    console.log("Upload successful: ", response);
    return response;
  } catch (error) {
    console.error("Error during image upload: ", error);
    throw error;
  }
};

export const uploadCategoryIcon = async (id, file) => {
  try {
    console.log("file: ", file);
    const formData = new FormData();
    formData.append("image", file);
    console.log("formData: ", formData);

    const response = await post(
      `/api/v1/images/category-icons/${id}`,
      formData
    );
    console.log("Upload successful: ", response);
    return response;
  } catch (error) {
    console.error("Error during image upload: ", error);
    throw error;
  }
};
