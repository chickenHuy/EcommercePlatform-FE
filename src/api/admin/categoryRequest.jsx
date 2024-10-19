import { get, post, put } from "@/lib/httpClient";

export const getAllCategory = (page) => {
  try {
    const response = get(`/api/v1/categories?page=${page}&size=8`);
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
}


export const addComponentByCategoryId = (categoryId, data) => {
  try {
    const response = put(`/api/v1/categories/${categoryId}/components`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}

export const getAllComponent = () => {
  try {
    const response = get(`/api/v1/components`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}