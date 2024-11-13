import { post } from "@/lib/httpClient";

export const authenticateWithGoogle = (authCode) => {
  try {
    const response = post(
      `/api/v1/external-auths/authentication/google?code=${authCode}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error; 
  }
};

export const authenticateWithFacebook = (authCode) => {
  try {
    const response = post(
      `/api/v1/external-auths/authentication/facebook?code=${authCode}`
    );
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error; 
  }
};
