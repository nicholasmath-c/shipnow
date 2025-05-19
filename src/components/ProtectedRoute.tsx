import { useEffect, PropsWithChildren, useMemo, useState } from "react";
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

  const [canRender, setCanRender] = useState(false);

  const hasPermission = useMemo(() => {
    if (!user) return false;
    if (!allowedRoles) return true;
    return allowedRoles.includes(user.role);
  }, [user, allowedRoles]);

  useEffect(() => {
    const isLoginPage = location.pathname === "/login";
    const is403Page = location.pathname === "/403";

    // Se ainda não sabemos o estado do user, aguardamos
    if (user === undefined) return;

    if (!token && !user && !isLoginPage) {
      navigate("/login", { replace: true });
      return;
    }

    if (token && isLoginPage) {
      navigate("/", { replace: true });
      return;
    }

    if (token && !hasPermission && !is403Page) {
      navigate("/403", { replace: true });
      return;
    }

    // Só libera render se estiver tudo ok
    setCanRender(true);
  }, [location.pathname, navigate, token, user, hasPermission]);

  if (!canRender) {
    return null; // ou um loader, se preferir
  }

  return <>{children}</>;
};

export default ProtectedRoute;
