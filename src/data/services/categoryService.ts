import { api } from "@/api";
import { iCategory } from "../@types/category";

export async function listAllCategories() {
  return api
    .get("/categories")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getCategoryById(id: number) {
  return api
    .get(`/categories/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function createCategory(category: iCategory) {
  return api
    .post(`/categories`, category)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function deleteCategory(id: number) {
  return api
    .delete(`/categories/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function editCategory(id: number, category: iCategory) {
  return api
    .put(`categories/${id}`, category)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}
