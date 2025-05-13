import { useHeader } from "../data/contexts/HeaderContext.tsx";
import { useEffect, useState } from "react";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout.tsx";
import SectionCards from "@/components/SectionCards.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import {
  listAllTickets,
  listAllTicketsByRequester,
} from "@/data/services/ticketService.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { useTicket } from "@/data/contexts/TicketsContext.tsx";
import TicketCard from "@/components/TicketCard.tsx";
import { toast } from "sonner";
import SPLoader from "@/components/SpinnerLoader.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Home() {
  const { setTitle } = useHeader();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle("Página Inicial");
  }, [setTitle]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-24">
        <SPLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["user", "tech", "admin"]}>
      <DashboardContentLayout>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
            </div>
          </div>
        </div>
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
