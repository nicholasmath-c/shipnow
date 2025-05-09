import { api } from "@/api";

export async function login(username: string, password: string) {
  return await api
    .post("auth/login", {
      username,
      password,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function logout() {
  return await api("/auth/logout", {
    method: "DELETE",
  });
}
