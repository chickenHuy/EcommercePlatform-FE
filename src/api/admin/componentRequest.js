import { del, get, post, put } from "@/lib/httpClient";

const getComponent = async (page, size, search) => {
  try {
    const response = await get(`/api/v1/components?page=${page}&size=${size}&search=${search}`);
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

const getAllComponent = () => {
  try {
    const response = get(`/api/v1/components/all`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

const getComponentOfCategory = (id) => {
  try {
    const response = get(`/api/v1/components/category/${id}`);
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};

export { getComponent, createComponent, updateComponent, removeComponent, getAllComponent, getComponentOfCategory };
