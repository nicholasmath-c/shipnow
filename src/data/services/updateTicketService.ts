import { api } from "@/api";
import { iUpdateTicketPost } from "../@types/updateTicket";

export async function listAllUpdateTicket() {
  return api
    .get("/update-ticket")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    })
}

export async function listAllUpdateTicketByTicket(id_ticket: number) {
  return api
    .get(`/update-ticket/ticket/${id_ticket}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    })
}

export async function getUpdateTicketById(id: number) {
  return api
    .get(`/update-ticket/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    })
}

export async function createUpdateTicket(updateTicket: iUpdateTicketPost | undefined) {
  return api
    .post(`/update-ticket`, updateTicket)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    })
}

export async function deleteUpdateTicket(id: number) {
  return api
    .delete(`/update-ticket/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    })
}

export async function editUpdateTicket(id: number, updateTicket: iUpdateTicketPost) {
  return api
    .put(`tickets/${id}`, updateTicket)
    .then((response) => {
      return response
    })
    .catch((error) => {
      return error.response
    })
}