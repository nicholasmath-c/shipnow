import { api } from "@/api";
import { iTicketPost } from "../@types/ticket";

export async function listAllTickets() {
  return api
    .get("/tickets")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function listAllTicketsByRequester(id_requester: number) {
  return api
    .get(`/tickets/requester/${id_requester}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function listAllTicketsByTech(id_tech: number) {
  return api
    .get(`/tickets/tech/${id_tech}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getTicketById(id: number) {
  return api
    .get(`/tickets/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function createTicket(ticket: iTicketPost) {
  return api
    .post(`/tickets`, ticket)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function deleteTicket(id: number) {
  return api
    .delete(`/tickets/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function editTicket(id: number, ticket: iTicketPost) {
  return api
    .put(`tickets/${id}`, ticket)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getCompanyDailySales(id: number) {
  return api
    .get(`/companies/${id}/daily-sales`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getCompanyOrderCountByStatus(id: number) {
  return api
    .get(`/companies/${id}/orders/status-summary`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getCompanyCurrentMonthSales(id: number) {
  return api
    .get(`/companies/${id}/current-month-sales`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getCompanyCurrentMonthDeliveredOrders(id: number) {
  return api
    .get(`/companies/${id}/orders/current-month-delivery`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getCompanyCurrentMonthShippingValue(id: number) {
  return api
    .get(`/companies/${id}/current-month-shipping-value`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}
