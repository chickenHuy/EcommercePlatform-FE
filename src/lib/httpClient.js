import Cookies from "js-cookie";

const request = async (
  endpoint,
  { method = "GET", headers = {}, body = null, signal = null } = {}
) => {
  try {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_NAME);

    const isFormData = body instanceof FormData;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: isFormData ? body : body ? JSON.stringify(body) : null,
        signal,
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        console.error("Error parsing JSON from response", jsonError);
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw error;
  }
};

const get = (endpoint, options = {}) => {
  return request(endpoint, { method: "GET", ...options });
};

const post = (endpoint, body, options = {}) => {
  return request(endpoint, { method: "POST", body, ...options });
};

const put = (endpoint, body, options = {}) => {
  return request(endpoint, { method: "PUT", body, ...options });
};

const del = (endpoint, options = {}) => {
  return request(endpoint, { method: "DELETE", ...options });
};

export { get, post, put, del };
