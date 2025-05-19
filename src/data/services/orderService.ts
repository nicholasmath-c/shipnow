import { api } from "@/api";
import { iOrder } from "../@types/order";

export async function listAllOrders() {
  return api
    .get("/orders")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function listAllOrdersByCompany(company_id: number) {
  return api
    .get(`/orders/company/${company_id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getOrderById(id: number) {
  return api
    .get(`/orders/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function createOrder(order: iOrder) {
  return api
    .post(`/orders`, order)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function editOrder(id: number, order: iOrder) {
  return api
    .put(`orders/${id}`, order)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function deleteOrder(id: number) {
  return api
    .delete(`/orders/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}
