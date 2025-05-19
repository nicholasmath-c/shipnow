import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type WebSocketMessage = {
  type: string;
  data: any;
};

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const { token } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Cria a conexão WebSocket
    if (token) {
      wsRef.current = new WebSocket(
        `${import.meta.env.VITE_WS_URL}?token=${token}`
      );

      // Configura os event listeners
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      // Função de limpeza
      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [token]);

  // Função para enviar mensagens
  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, lastMessage, sendMessage };
};
