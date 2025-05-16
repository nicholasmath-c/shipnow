import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Banknote, Package, ShoppingBag, Truck } from "lucide-react";
import CardHomeDashboard from "./CardDashboard";
import { useEffect, useState } from "react";
import { useAuth } from "@/data/contexts/AuthContext";
import {
  iCompanyCurrentMonthDeliveredOrders,
  iCompanyCurrentMonthSales,
  iCompanyCurrentMonthShippingValue,
} from "@/data/@types/company";
import {
  getCompanyCurrentMonthDeliveredOrders,
  getCompanyCurrentMonthSales,
  getCompanyCurrentMonthShippingValue,
} from "@/data/services/companyService";
import { SPLoaderInCard } from "./SpinnerLoader";

export default function SectionCards() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonthSales, setCurrentMonthSales] =
    useState<iCompanyCurrentMonthSales>();
  const [currentMonthDeliveries, setCurrentMonthDeliveries] =
    useState<iCompanyCurrentMonthDeliveredOrders>();
  const [currentMonthShippingValue, setCurrentMonthShippingValue] =
    useState<iCompanyCurrentMonthShippingValue>();

  useEffect(() => {
    const request = async () => {
      if (user) {
        const sales = await getCompanyCurrentMonthSales(user.id);
        const deliveries = await getCompanyCurrentMonthDeliveredOrders(user.id);
        const shipping_value = await getCompanyCurrentMonthShippingValue(
          user.id
        );
        setCurrentMonthSales(sales[0]);
        setCurrentMonthDeliveries(deliveries[0]);
        setCurrentMonthShippingValue(shipping_value[0]);
        setIsLoading(false);
      }
    };

    request();
  }, [user]);

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @6xl/main:grid-cols-4 grid grid-cols-1 gap-4 md:gap-8 *:data-[slot=card]:bg-white *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <CardHomeDashboard
        title={`${currentMonthSales?.current_month_sales}€`}
        description={
          <p>
            Vendas este mês{" "}
            <span className="ml-1 text-xs text-muted-foreground/70">
              vs Mês anterior
            </span>
          </p>
        }
        percentage={
          currentMonthSales && currentMonthSales?.percentage_change > 0
            ? `+${currentMonthSales?.percentage_change}%`
            : `${currentMonthSales?.percentage_change}%`
        }
        isPercentage={
          currentMonthSales && currentMonthSales?.percentage_change > 0
            ? "up"
            : "down"
        }
      >
        <Banknote />
      </CardHomeDashboard>
      <CardHomeDashboard
        title={currentMonthDeliveries?.current_month_deliveries}
        description={
          <p>
            Entregas esse mês{" "}
            <span className="ml-1 text-xs text-muted-foreground/70">
              vs Mês anterior
            </span>
          </p>
        }
        percentage={
          currentMonthDeliveries &&
          currentMonthDeliveries?.percentage_change > 0
            ? `+${currentMonthDeliveries?.percentage_change}%`
            : `${currentMonthDeliveries?.percentage_change}%`
        }
        isPercentage={
          currentMonthDeliveries &&
          currentMonthDeliveries?.percentage_change > 0
            ? "up"
            : "down"
        }
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
        title={`${currentMonthShippingValue?.total_shipping_value}€`}
        description="Soma do frete mensal"
        isPercentage="none"
      >
        <Truck />
      </CardHomeDashboard>
    </div>
  );
}
