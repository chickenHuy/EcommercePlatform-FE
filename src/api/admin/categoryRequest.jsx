import { get } from "@/lib/httpClient";

export const getAllCategory = (page) => {
  try {
    const response = get(`/api/v1/categories?page=${page}&size=8`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getCategoryById = (categoryId) => {
  try {
    const response = get(`/api/v1/categories/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
