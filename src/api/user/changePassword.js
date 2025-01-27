import { put } from "@/lib/httpClient";

export const updatePassword = async (passwordData) => {
  try {
    const response = await put("/api/v1/users/update-password", passwordData);
    return response;
  } catch (error) {
    console.error("Error during updatePassword: ", error);
    throw error;
  }
};
