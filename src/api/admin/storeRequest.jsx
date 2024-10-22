import { get } from "@/lib/httpClient";

export const getAllStore = (page, tab, sortType, search = "") => {
  try {
    const response = get(
      `/api/v1/stores?page=${page}&size=2&tab=${tab}&sort=${sortType}&search=${search}`
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
