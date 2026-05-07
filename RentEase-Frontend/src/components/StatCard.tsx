import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "accent" | "success" | "info";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
};

export default function StatCard({ title, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {trend && <p className="mt-1 text-xs text-success font-medium">{trend}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
