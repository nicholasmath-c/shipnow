// src/contexts/HeaderContext.tsx
import { createContext, useContext, useState } from "react";

type HeaderContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const HeaderContext = createContext<HeaderContextType>({
  title: "",
  setTitle: () => {},
});

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("");

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
