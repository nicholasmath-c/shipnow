import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { iOrder } from "../@types/order";
import {
  listAllOrders,
  listAllOrdersByCompany,
} from "../services/orderService";
import { useAuth } from "./AuthContext";
import SPLoader from "@/components/SpinnerLoader";
import { Navigate } from "react-router-dom";

type OrdersContextType = {
  orders?: iOrder[] | null;
  setOrders: (order: iOrder[] | null) => void;
};

const OrdersContext = createContext<OrdersContextType>({
  orders: null,
  setOrders: () => {},
});

type OrdersProviderProps = PropsWithChildren;

export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [orders, setOrders] = useState<iOrder[] | null>();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token || !user) return;

    const request = async () => {
      setIsLoading(true);
      if (user?.role === "merchant") {
        setOrders(await listAllOrdersByCompany(user.company_id));
      } else {
        setOrders(await listAllOrders());
      }
      setIsLoading(false);
    };

    request();
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto flex justify-center items-center h-svh">
        <SPLoader />
      </div>
    );
  }

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
