import { get, post, put, del } from "@/lib/httpClient";

export const getProfile = async () => {
  try {
    const response = await get(`/api/v1/users/me`);
    return response;
  } catch (error) {
    console.error("Error during getProfile:", error);
    throw error;
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const response = await put(`/api/v1/users/${userId}`, profileData);
    return response;
  } catch (error) {
    console.error("Error during update profile:", error);
    throw error;
  }
};

export const uploadUserImage = async (file) => {
  try {
    console.log("file: ", file);
    const formData = new FormData();
    formData.append("image", file);
    console.log("formData: ", formData);

    const response = await post(`/api/v1/images/users`, formData);
    console.log("Upload successful: ", response);
    return response;
  } catch (error) {
    console.error("Error during image upload: ", error);
    throw error;
  }
};
