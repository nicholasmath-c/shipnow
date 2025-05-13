import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface CardHomeDashboardProps {
  title: string;
  description: string;
  percentage?: string;
  isPercentage: string; //up - down - none
  children: React.ReactNode;
}

export default function CardHomeDashboard({
  title,
  description,
  percentage,
  isPercentage,
  children,
}: CardHomeDashboardProps) {
  return (
    <Card className="@container/card">
      <CardContent className="relative flex gap-4 items-center justify-between">
        <div>
          <CardDescription className="mb-2">{description}</CardDescription>
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-semibold tabular-nums flex gap-4">
              {title}
            </CardTitle>
            {isPercentage !== "none" && (
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-[11px]"
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
        <div className="bg-muted p-3 h-fit rounded-xl size-12 text-primary">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
