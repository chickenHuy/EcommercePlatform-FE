import { get, put } from "@/lib/httpClient";

export const getStoreByUserId = async () => {
  try {
    const response = await get(`/api/v1/stores/information`);
    return response;
  } catch (error) {
    console.error("Error during get store:", error);
    throw error;
  }
};

export const getAddressOfStore = async () => {
  try {
    const response = await get(`/api/v1/stores/addresses/seller`);
    return response;
  } catch (error) {
    console.error("Error during get store:", error);
    throw error;
  }
};

export const updateStore = async (storeData) => {
  try {
    const response = await put(`/api/v1/stores/update-store`, storeData);
    return response;
  } catch (error) {
    console.error("Error during update store:", error);
    throw error;
  }
};
