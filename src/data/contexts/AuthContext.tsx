import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  PropsWithChildren,
} from "react";
import { api } from "@/api.ts";
import SPLoader from "@/components/SpinnerLoader";
import { useLoading } from "./LoadingContext";
import { User } from "../@types/user";

type AuthContextType = {
  token?: string | null;
  user?: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
});

type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>();
  const [user, setUser] = useState<User | null>();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    const request = async () => {
      try {
        const response = await api.get("/auth/token");
        setToken(response.data.accessToken);
        setUser(response.data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (location.pathname !== "/login") {
      request();
    }
  }, []);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (config.url === "auth/login") {
        return config;
      }

      config.headers.Authorization =
        !(config as any)._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url === "auth/login") {
          return Promise.reject(error);
        }

        if (error.response.status === 403) {
          try {
            const response = await api("/auth/token");

            setToken(response.data.accessToken);
            setUser(response.data.user);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return api(originalRequest);
          } catch {
            setToken(null);
            setUser(null);
          }
        }
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  if (isLoading) {
    return (
      <div className="w-full h-dvh flex flex-col items-center align-middle justify-center relative z-10">
        <SPLoader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
