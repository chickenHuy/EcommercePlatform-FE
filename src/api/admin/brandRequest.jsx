import { get, post, put, del } from "@/lib/httpClient";

export const getAllBrand = (page) => {
  try {
    const response = get(`/api/v1/brands?page=${page}&size=10`);
    return response;
  } catch (error) {
    console.error("Error during get all brand:", error);
    throw error;
  }
};

export const createBrand = async (data) => {
  try {
    const response = await post("/api/v1/brands", data);
    return response;
  } catch (error) {
    console.error("Error during creating brand:", error);
    throw error;
  }
};

export const updateBrand = async (id, data) => {
  try {
    const response = await put(`/api/v1/brands/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error during updating brand:", error);
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await del(`/api/v1/brands/${id}`);
    return response;
  } catch (error) {
    console.error("Error during deleting brand:", error);
    throw error;
  }
};
