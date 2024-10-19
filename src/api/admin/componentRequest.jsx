import { get } from "@/lib/httpClient";

export const getAllComponent = (page) => {
  try {
    const response = get(`/api/v1/components?page=${page}&size=6`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
