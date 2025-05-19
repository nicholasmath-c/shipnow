"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "../hooks/use-mobile.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { getCompanyDailySales } from "@/data/services/companyService.ts";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { SPLoaderInCard } from "../SpinnerLoader.tsx";
import { useOrders } from "@/data/contexts/OrdersContext.tsx";

const chartConfig = {
  total_value: {
    label: "Vendas totais: ",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DailySalesAreaChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("30d");
  const [chartData, setChartData] = useState([]);
  const { orders } = useOrders();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  useEffect(() => {
    const response = async () => {
      if (user) {
        setChartData(await getCompanyDailySales(user.company_id));
        setIsLoading(false);
      }
    };

    response();
  }, [setChartData, user, orders]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = Date.now();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card h-[450px]">
      <CardHeader className="relative">
        <CardTitle>Vendas</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total de vendas por dia nos últimos 3 meses
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              3 meses
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 dias
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 dias
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {!isLoading ? (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillTotalValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_value)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_value)"
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="line"
                    formatter={(value, name) => (
                      <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value}
                          <span className="font-normal text-muted-foreground">
                            €
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="total_value"
                type="natural"
                fill="url(#fillTotalValue)"
                stroke="var(--color-total_value)"
                stackId="a"
              />
            </AreaChart>
          ) : (
            <SPLoaderInCard />
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
