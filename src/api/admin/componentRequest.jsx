import { get } from "@/lib/httpClient";

export const getAllComponent = () => {
  try {
    const response = get(`/api/v1/components/all`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export const getComponentOfCategory = (id) => {
  try {
    const response = get(`/api/v1/components/${id}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
