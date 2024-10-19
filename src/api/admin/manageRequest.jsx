import { get, put } from "@/lib/httpClient";

export const getAllAdmin = (page, tab, sortType) => {
  try {
    const response = get(
      `/api/v1/users/manages?page=${page}&size=8&tab=${tab}&sort=${sortType}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getAdminById = (adminId) => {
  try {
    const response = get(`/api/v1/users/${adminId}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const handleAccountAdmin = (accountId, password) => {
  try {
    const data = { password: password, id: accountId };
    console.log(data);

    const response = put(`/api/v1/users/customers`, data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
