import { api } from "@/api";

export async function listAllAttachmentsByTicket(id_ticket: number) {
  return api
    .get(`/attachments/ticket/${id_ticket}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export async function listAllAttachmentsByUpdateTicket(id_update_ticket: number) {
  return api
    .get(`/attachments/update-ticket/${id_update_ticket}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
}

export const createAttachment = async (
  ticketId: number, 
  id_usuario: number | undefined, 
  file: File // Recebe o arquivo diretamente
) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // Adiciona o arquivo
    formData.append('id_usuario', id_usuario?.toString() || ''); // Adiciona o ID do usuário
    
    const response = await api.post(
      `/attachments/ticket/${ticketId}`, 
      formData, // Envia o FormData diretamente
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

export const createAttachmentInUpdateTicket = async (
  updateTicket: number, 
  id_usuario: number | undefined, 
  file: File // Recebe o arquivo diretamente
) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // Adiciona o arquivo
    formData.append('id_usuario', id_usuario?.toString() || ''); // Adiciona o ID do usuário
    
    const response = await api.post(
      `/attachments/update-ticket/${updateTicket}`, 
      formData, // Envia o FormData diretamente
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

export async function deleteAttachment(id: number) {
  return api
    .delete(`/attachments/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}