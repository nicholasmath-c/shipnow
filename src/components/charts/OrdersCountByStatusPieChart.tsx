"use client";

import { TrendingUp } from "lucide-react";
import { Label, LabelList, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "../hooks/use-mobile";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "@/data/contexts/AuthContext";
import { getCompanyOrderCountByStatus } from "@/data/services/companyService";
import { SPLoaderInCard } from "../SpinnerLoader";

const chartConfig = {
  orders: {
    label: "Pedidos",
  },
  pending: {
    label: "Pendente",
    color: "#F9C74F",
  },
  processing: {
    label: "Processando",
    color: "#6399ff",
  },
  ready_to_ship: {
    label: "Pronto para envio",
    color: "#e78923",
  },
  pickup_in_transit: {
    label: "Em transito - Recolhimento",
    color: "#5f5cc0",
  },
  delivery_in_transit: {
    label: "Em transito - Entrega",
    color: "#271e5f",
  },
  delivered: {
    label: "Entregue",
    color: "#58d183",
  },
  canceled: {
    label: "Cancelado",
    color: "#fd605b",
  },
} satisfies ChartConfig;

type OrderStatusData = {
  status: string;
  quantity: number;
};

export function OrdersCountByStatusPieChart() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<OrderStatusData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const request = async () => {
      if (user) {
        const data = await getCompanyOrderCountByStatus(user.id);
        const formattedData = data.map((item: OrderStatusData) => {
          const config = chartConfig[item.status as keyof typeof chartConfig];
          return {
            ...item,
            fill: config?.color || "#ccc", // cor de fallback se não encontrar
          };
        });
        setChartData(formattedData);
        setActiveStatus(formattedData[0]?.status); // garante que só seta se existir
        setIsLoading(false);
      }
    };

    request();
  }, [user]);

  const id = "pie-interactive";
  const [activeStatus, setActiveStatus] = useState<string | undefined>();
  const activeIndex = useMemo(
    () => chartData.findIndex((item) => item?.status === activeStatus),
    [activeStatus]
  );
  const months = useMemo(
    () => chartData.map((item) => item?.status),
    [chartData]
  );

  return (
    <Card data-chart={id} className="flex flex-col h-[450px]">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Status dos pedidos</CardTitle>
          <CardDescription>Situação atual dos pedidos</CardDescription>
        </div>
        {!isLoading ? (
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger
              className="ml-auto h-7 w-fit rounded-lg pl-2.5"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>

            <SelectContent align="end" className="rounded-xl">
              {months.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];
                if (!config) {
                  return null;
                }
                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          null
        )}
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full h-[300px]"
        >
          {!isLoading ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="quantity"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (
                      viewBox &&
                      "cx" in viewBox &&
                      "cy" in viewBox &&
                      chartData[activeIndex]
                    ) {
                      const quantity =
                        chartData[activeIndex].quantity.toLocaleString();
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {quantity}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Pedidos
                          </tspan>
                        </text>
                      );
                    }
                    return null; // <- evita erro durante o carregamento
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <SPLoaderInCard />
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
