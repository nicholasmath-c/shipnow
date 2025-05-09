import { useEffect } from "react";
import { useHeader } from "@/data/contexts/HeaderContext";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Users() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Usuários");
  }, [setTitle]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardContentLayout>
        <div>Usuários</div>
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
