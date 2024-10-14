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
    const formData = new FormData();
    formData.append("image", file);

    const response = await post(`/api/v1/images/users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload successful:", response);
    return response;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw error;
  }
};
