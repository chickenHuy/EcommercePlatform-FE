import { get } from "@/lib/httpClient";

export const getAllUser = (page) => {
  try {
    const response = get(`/api/v1/users/customers?page=${page}&size=10`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
