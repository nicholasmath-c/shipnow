import { api } from "@/api";
import { iUnit } from "../@types/unit";

export async function listAllUnities() {
  return api
    .get("/unities")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getUnitById(id: number) {
  return api
    .get(`/unities/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function createUnit(unit: iUnit) {
  return api
    .post(`/unities`, unit)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function deleteUnit(id: number) {
  return api
    .delete(`/unities/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function editUnit(id: number, unit: iUnit) {
  return api
    .put(`unities/${id}`, unit)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}
