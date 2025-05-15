import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface CardDashboardProps {
  title: string;
  description: string;
  percentage?: string;
  isPercentage: string; //up - down - none
  children: React.ReactNode;
}

export default function CardDashboard({
  title,
  description,
  percentage,
  isPercentage,
  children,
}: CardDashboardProps) {
  return (
    <Card className="@container/card">
      <CardContent className="flex items-center justify-between">
        <div>
          <CardDescription className="mb-2">{description}</CardDescription>
          <div className="flex flex-col @[350px]/card:flex-row @[350px]/card:items-center @[350px]/card:gap-4 gap-2">
            <CardTitle className="text-2xl font-semibold tabular-nums flex gap-4">
              {title}
            </CardTitle>
            {isPercentage !== "none" && (
              <Badge
                variant="outline"
                className="gap-1 rounded-lg text-[11px]"
              >
                {isPercentage === "up" ? (
                  <TrendingUpIcon className="size-3" />
                ) : isPercentage === "down" ? (
                  <TrendingDownIcon className="size-3" />
                ) : null}
                {percentage}
              </Badge>
            )}
          </div>
        </div>
        <div className="bg-muted ml-4 p-3 h-fit rounded-xl size-12 text-primary">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
