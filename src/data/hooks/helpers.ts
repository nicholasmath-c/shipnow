import { iAttachment } from "../@types/attachment";
import { iTicket } from "../@types/ticket";

export const status = {
  pending: {
    label: "Pendente",
    color: "#F9C74F",
    cssVariable: "--status-pending",
  },
  processing: {
    label: "Processando",
    color: "#6399ff",
    cssVariable: "--status-processing",
  },
  ready_to_ship: {
    label: "Pronto para envio",
    color: "#e78923",
    cssVariable: "--status-ready_to_ship",
  },
  pickup_in_transit: {
    label: "Em transito - Recolhimento",
    color: "#5f5cc0",
    cssVariable: "--status-pickup_in_transit",
  },
  delivery_in_transit: {
    label: "Em transito - Entrega",
    color: "#271e5f",
    cssVariable: "--status-delivery_in_transit",
  },
  delivered: {
    label: "Entregue",
    color: "#58d183",
    cssVariable: "--status-delivered",
  },
  canceled: {
    label: "Cancelado",
    color: "#fd605b",
    cssVariable: "--status-canceled",
  },
};

export function badgeColors(campo: string) {
  let cor;

  switch (campo) {
    case "baixo":
      cor = "bg-emerald-700";
      break;
    case "aberto":
      cor = "bg-blue-600";
      break;
    case "medio":
      cor = "bg-amber-600";
      break;
    case "em_andamento":
      cor = "bg-orange-600";
      break;
    case "alto":
      cor = "bg-rose-700";
      break;
    case "finalizado":
      cor = "bg-emerald-800";
      break;
    case null:
      cor = "bg-neutral-900";
      break;
  }

  return cor;
}

export function createImageURLByAttachment(attachment: iAttachment) {
  const byteArray = attachment?.dados?.data;

  // Cria um Uint8Array a partir dos bytes
  const uint8Array = new Uint8Array(byteArray);

  // Cria o Blob (ajuste o type conforme o tipo real da imagem)
  // Pelo header (255, 216 = JPEG), mas pode verificar melhor
  let blob;
  switch (attachment?.tipo_arquivo) {
    case "image/jpeg":
      blob = new Blob([uint8Array], { type: "image/jpeg" });
      break;
    case "image/jpg":
      blob = new Blob([uint8Array], { type: "image/jpg" });
      break;
    case "image/png":
      blob = new Blob([uint8Array], { type: "image/png" });
      break;
    case "application/pdf":
      blob = new Blob([uint8Array], { type: "application/pdf" });
      break;
  }

  //Cria a URL da imagem / arquivo
  if (blob) {
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }
}

interface verifyUserTicketOpenProps {
  user: { id: number; login: string; name: string; role: string };
  ticket: iTicket;
}

export function verifyUserTicketOpen({
  user,
  ticket,
}: verifyUserTicketOpenProps) {
  return (
    (user && user.role === "admin") ||
    (user.role === "user" && ticket.situacao === "aberto") ||
    (user.role === "tech" &&
      ticket.id_solicitante === user.id &&
      ticket.situacao === "aberto")
  );
}
