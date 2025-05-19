import { useHeader } from "../data/contexts/HeaderContext.tsx";
import { useEffect, useState } from "react";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout.tsx";
import SectionCards from "@/components/SectionCards.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import SPLoader from "@/components/SpinnerLoader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DailySalesAreaChart } from "@/components/charts/DailySalesAreaChart.tsx";
import { OrdersCountByStatusPieChart } from "@/components/charts/OrdersCountByStatusPieChart.tsx";
import { OrderListener } from "@/components/listeners/OrderListener.tsx";
import { useWebSocket } from "@/data/hooks/useWebSocket.ts";
import OrdersMerchantHomeDataTable from "@/components/tables/orders-merchant/page.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export default function Home() {
  const { setTitle } = useHeader();
  const { user } = useAuth();
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    setTitle("Página Inicial");
  }, []);

  return (
    <ProtectedRoute>
      <DashboardContentLayout>
        <SectionCards />
        <div className="flex lg:flex-row flex-col w-full gap-4 md:gap-8 align-stretch [container-type:inline-size]">
          <div className="w-full">
            <DailySalesAreaChart />
          </div>
          <div className="w-full">
            <OrdersCountByStatusPieChart />
          </div>
        </div>
        <Card>
          <CardHeader className="flex justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Pedidos</CardTitle>
              <CardDescription>
                Resumo de todas as solicitações de entrega e recolhimento feitas
              </CardDescription>
            </div>
            <Button>Criar pedido</Button>
          </CardHeader>
          <CardContent>
            <OrdersMerchantHomeDataTable />
          </CardContent>
        </Card>
      </DashboardContentLayout>
      <OrderListener message={lastMessage} />
    </ProtectedRoute>
  );
}
