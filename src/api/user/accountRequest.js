import { get, post, put } from "@/lib/httpClient";

export const getAccount = async () => {
  try {
    const response = await get(`/api/v1/users/me`);
    return response;
  } catch (error) {
    console.error("Error during get account:", error);
    throw error;
  }
};

export const updateEmail = async (emailData) => {
  try {
    const response = await put(`/api/v1/emails/user/email`, emailData);
    return response;
  } catch (error) {
    console.error("Error during update email:", error);
    throw error;
  }
};

export const updatePhone = async (phoneData) => {
  try {
    const response = await put(`/api/v1/emails/user/phone`, phoneData);
    return response;
  } catch (error) {
    console.error("Error during update phone:", error);
    throw error;
  }
};

export const sendMailValidation = () => {
  try {
    const response = post(`/api/v1/emails/send-verification`);
    return response;
  } catch (error) {
    console.error("Error during send mail validation:", error);
    throw error;
  }
};
