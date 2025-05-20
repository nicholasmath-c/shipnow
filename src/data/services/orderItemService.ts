import { api } from "@/api";
import { iOrderItem } from "../@types/orderItem";

export async function listAllOrderItems() {
  return api
    .get("/order-items")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function listAllOrdersItemsByOrder(order_id: number) {
  return api
    .get(`/order-items/order/${order_id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function listAllOrdersItemsByProduct(product_id: number) {
  return api
    .get(`/order-items/product/${product_id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getOrderItemById(id: number) {
  return api
    .get(`/order-items/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function createOrderItem(orderItem: iOrderItem) {
  return api
    .post(`/order-items`, orderItem)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function editOrderItem(id: number, orderItem: iOrderItem) {
  return api
    .put(`/orders-items/${id}`, orderItem)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function deleteOrderItem(id: number) {
  return api
    .delete(`/order-items/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}
