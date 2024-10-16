import { get } from "@/lib/httpClient";

export const getAllStore = (page, tab, sortDate, sortName) => {
  try {
    const response = get(
      `/api/v1/stores?page=${page}&size=8&tab=${tab}&date=${sortDate}&name=${sortName}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getStoreById = (storeId) => {
  try {
    const response = get(`/api/v1/stores/${storeId}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
