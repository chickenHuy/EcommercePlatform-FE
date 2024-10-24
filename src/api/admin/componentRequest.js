import { del, get, post, put } from "@/lib/httpClient";

const getComponent = async (page, size) => {
  try {
    const response = await get(`/api/v1/components?page=${page}&size=${size}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const createComponent = async (data) => {
  try {
    const response = await post(`/api/v1/components`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateComponent = async (id, data) => {
  try {
    const response = await put(`/api/v1/components/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

const removeComponent = async (id, data) => {
  try {
    const response = await del(`/api/v1/components/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export { getComponent, createComponent , updateComponent, removeComponent};
