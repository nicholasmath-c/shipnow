// src/contexts/HeaderContext.tsx
import { createContext, useContext, useState } from "react";
import { iTicket } from "../@types/ticket";

type TicketContextType = {
  tickets?: iTicket[] | null;
  setTicket: (ticket: iTicket[]) => void;
};

const TicketContext = createContext<TicketContextType>({
  tickets: null,
  setTicket: () => {}
});

export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickets, setTicket] = useState<iTicket[] | null>();

  return (
    <TicketContext.Provider value={{ tickets, setTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);
