import { get, post, put } from "@/lib/httpClient";

export const getAllUser = (page, tab, sortDate, sortName) => {
  try {
    const response = get(`/api/v1/users/customers?page=${page}&size=8&tab=${tab}&date=${sortDate}&name=${sortName}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};


export const getUserById = (userId) => {
  try {
    const response = get(`/api/v1/users/${userId}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}


export const handleAccountCustomer = (accountId, password) => {
  try {
    const data = {password: password,
                  id: accountId}
                  console.log(data);
    
    const response = put(`/api/v1/users/customers`,data);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};