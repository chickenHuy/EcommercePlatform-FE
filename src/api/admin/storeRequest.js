import { get, patch } from "@/lib/httpClient";

export const getAllStore = (page, tab, sortType, search = "") => {
  try {
    const response = get(
      `/api/v1/stores?page=${page}&size=8&tab=${tab}&sort=${sortType}&search=${search}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getStoreById = (storeId) => {
  try {
    const response = get(`/api/v1/stores/${storeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const changeStatus = (storeId) => {
  try {
    const response = patch(`/api/v1/stores/update-status/${storeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
