import { useEffect, PropsWithChildren, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/data/contexts/AuthContext";
import { User } from "../data/@types/user.ts";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: User["role"][];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();

  // Memoize a verificação de permissão para evitar recálculos desnecessários
  const hasPermission = useMemo(() => {
    if (!user) return false;
    if (!allowedRoles) return true;
    return allowedRoles.includes(user.role);
  }, [user, allowedRoles]);

  useEffect(() => {
    // Se ainda está carregando o estado do usuário, não faz nada
    if (user === undefined) return;

    const isLoginPage = location.pathname === "/login";
    const is403Page = location.pathname === "/403";

    // Redirecionamentos prioritários
    if (!token && !isLoginPage) {
      navigate("/login", { replace: true });
      return;
    }

    if (token && isLoginPage) {
      navigate("/", { replace: true });
      return;
    }

    // Verificação de permissões
    if (token && !hasPermission && !is403Page) {
      navigate("/403", { replace: true });
      return;
    }
  }, [location.pathname, navigate, token, user, hasPermission]);

  return <>{children}</>;
};

export default ProtectedRoute;
