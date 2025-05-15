import { useHeader } from "../data/contexts/HeaderContext.tsx";
import { useEffect, useState } from "react";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import SPLoader from "@/components/SpinnerLoader.tsx";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { iUser } from "@/data/@types/user.ts";
import { getUserById } from "@/data/services/userService.ts";
import { toast } from "sonner";
import CardUser from "@/components/CardUser.tsx";

export default function Account() {
  const { setTitle } = useHeader();
  const { user } = useAuth();
  const [allUserInfo, setAllUserInfo] = useState<iUser>();
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    setTitle("Conta");
  }, [setTitle]);

  useEffect(() => {
    const request = async () => {
      if (user) {
        try {
          const getUser = await getUserById(user?.id);
          setAllUserInfo(getUser[0]);
        } catch (error) {
          toast.error("Erro ao puxar os dados do usuário.");
        } finally {
          setIsloading(false);
        }
      }
    };

    request();
  }, [setAllUserInfo, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-24">
        <SPLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardContentLayout>
        <div className="flex flex-col items-center gap-16">
          <CardUser user={allUserInfo} />
        </div>
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
