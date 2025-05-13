import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Banknote, Package, ShoppingBag, Truck } from "lucide-react";
import CardHomeDashboard from "./CardHomeDashboard";


export default function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @6xl/main:grid-cols-4 grid grid-cols-1 gap-8 *:data-[slot=card]:bg-white *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <CardHomeDashboard
        title="1.250,00€"
        description="Vendas nos últimos 30 dias"
        percentage="+12.5%"
        isPercentage="up"
      >
        <Banknote />
      </CardHomeDashboard>
      <CardHomeDashboard
        title="1.234"
        description="Total de pedidos"
        percentage="-20%"
        isPercentage="down"
      >
        <ShoppingBag />
      </CardHomeDashboard>
      <CardHomeDashboard
        title="137"
        description="Produtos no inventário"
        isPercentage="none"
      >
        <Package />
      </CardHomeDashboard>
      <CardHomeDashboard
        title="100,00€"
        description="Soma do frete mensal"
        isPercentage="none"
      >
        <Truck />
      </CardHomeDashboard>
    </div>
  );
}
