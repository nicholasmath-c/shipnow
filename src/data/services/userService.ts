import { api } from "@/api";
import { iUserPost } from "../@types/user";

export async function listAllUsers() {
  return api
    .get("/users")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function getUserById(id: number) {
  return api
    .get(`/users/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function createUser(user: iUserPost) {
  return api
    .post(`/users`, user)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function deleteUser(id: number) {
  return api
    .delete(`/users/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function editUser(id: number | undefined, user: iUserPost) {
  return api
    .put(`users/${id}`, user)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function changePassword(
  id: number | undefined,
  user: iUserPost,
  oldPassword: string,
  newPassword: string
) {
  return api
    .put(`users/${id}/change-password`, {
      user: user,
      password: { old_password: oldPassword, new_password: newPassword },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}
