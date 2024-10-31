import { get, post, put } from "@/lib/httpClient";

export const getStore = async () => {
  try {
    const response = await get(`/api/v1/stores/information`);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during get store:", error);
    throw error;
  }
};

export const getAddressStore = async (userId) => {
  try {
    const response = await get(`/api/v1/stores/${userId}/addresses`);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during get store:", error);
    throw error;
  }
};

export const updateStore = async (userId, storeData) => {
  try {
    const response = await put(`/api/v1/stores/${userId}`, storeData);
    return response;
  } catch (error) {
    console.error("Error during update store:", error);
    throw error;
  }
};
