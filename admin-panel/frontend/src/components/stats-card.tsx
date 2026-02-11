import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color?: string;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, color = "var(--primary)" }: StatsCardProps) {
  return (
    <div className="rounded-xl border p-6 transition-all hover:shadow-md"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
            {value}
          </p>
          {change && (
            <p className={cn(
              "text-sm mt-1 font-medium",
              changeType === "positive" && "text-green-500",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-slate-500"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
