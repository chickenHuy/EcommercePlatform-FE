import { get, post, put, del } from "@/lib/httpClient";

export const getProfile = async () => {
  try {
    const response = await get(`/api/v1/users/me`);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during get profile:", error);
    throw error;
  }
};

export const updateProfile = async (userId, data) => {
  try {
    const response = await put(`/api/v1/users/${userId}`, data);
    return response;
  } catch (error) {
    console.error("Error during update profile:", error);
    throw error;
  }
};
