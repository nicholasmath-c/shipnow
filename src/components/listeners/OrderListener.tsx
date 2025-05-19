import { iOrder } from "@/data/@types/order";
import { useAuth } from "@/data/contexts/AuthContext";
import { useOrders } from "@/data/contexts/OrdersContext";
import {
  listAllOrders,
  listAllOrdersByCompany,
} from "@/data/services/orderService";
import { useEffect } from "react";
import { toast } from "sonner"; // ou outra lib de notificação

type WebSocketMessage = {
  type: string;
  data: iOrder;
};

interface OrderListenerProps {
  message: WebSocketMessage | null;
}

export const OrderListener = ({ message }: OrderListenerProps) => {
  const { setOrders } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    if (!message) return;

    const request = async () => {
      if (user?.role === "merchant") {
        setOrders(await listAllOrdersByCompany(user.company_id));
      } else {
        setOrders(await listAllOrders());
      }
    };

    request();

    switch (message.type) {
      case "ORDER":
        showNotification(`Pedido: ${message.data.status}`);
        break;
      // Adicione outros tipos de mensagens aqui
      default:
        break;
    }
  }, [message]);

  const showNotification = (text: string) => {
    // Notificação na UI (usando Sonner ou similar)
    toast.success(text, {
      position: "top-right",
      duration: 5000,
      action: {
        label: "Ver",
        onClick: () => {
          return;
        },
      },
    });
  };

  return null;
};
