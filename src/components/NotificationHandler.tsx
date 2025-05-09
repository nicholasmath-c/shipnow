import { useAuth } from "@/data/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner"; // ou outra lib de notificação

type WebSocketMessage = {
  type: string;
  data: any;
};

interface NotificationHandlerProps {
  message: WebSocketMessage | null;
}

export const NotificationHandler = ({ message }: NotificationHandlerProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "user") {
      if (!message) return;

      switch (message.type) {
        case "NEW_TICKET":
          if (message.data.situacao === "aberto") {
            showNotification(`Novo chamado: ${message.data.titulo}`);
          }
          break;
        // Adicione outros tipos de mensagens aqui
        default:
          break;
      }
    }
  }, [message]);

  const showNotification = (text: string) => {
    // Notificação do navegador
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Novo chamado", { body: text });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Novo chamado", { body: text });
          }
        });
      }
    }

    // Notificação na UI (usando Sonner ou similar)
    toast.success(text, {
      position: "top-right",
      duration: 5000,
      action: {
        label: "Ver",
        onClick: () => (window.location.href = "/tickets"),
      },
    });
  };

  return null;
};
