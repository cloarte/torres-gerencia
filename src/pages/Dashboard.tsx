import {
  TrendingUp,
  AlertCircle,
  Bell,
  Users,
  Truck,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Period = "hoy" | "semana" | "mes" | "anio";

const periods: { value: Period; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "anio", label: "Este año" },
];

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  variation?: string;
  variationColor?: string;
  icon: React.ElementType;
  iconColor?: string;
  badge?: { value: string; color: string };
  link?: { text: string; href: string };
  index: number;
}

function KpiCard({
  label,
  value,
  sub,
  variation,
  variationColor = "text-success",
  icon: Icon,
  iconColor = "text-muted-foreground",
  badge,
  link,
  index,
}: KpiCardProps) {
  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight">
            {label}
          </p>
          <div className="flex items-center gap-1.5">
            {badge && (
              <Badge className={cn("h-5 min-w-5 px-1.5 text-[10px] font-bold border-0 rounded-full", badge.color)}>
                {badge.value}
              </Badge>
            )}
            <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
          </div>
        </div>

        <p className="mt-3 text-2xl font-bold tabular-nums leading-none">{value}</p>

        {(variation || sub) && (
          <div className="mt-1.5 space-y-0.5">
            {variation && (
              <p className={cn("text-xs font-medium", variationColor)}>{variation}</p>
            )}
            {sub && (
              <p className="text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
        )}

        {link && (
          <a
            href={link.href}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors group"
          >
            {link.text}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("mes");

  const row1: Omit<KpiCardProps, "index">[] = [
    {
      label: "Ventas del día",
      value: "S/ 12,450",
      variation: "+8.3% vs ayer",
      variationColor: "text-success",
      icon: TrendingUp,
      iconColor: "text-success",
      link: { text: "Ver Reporte Ventas →", href: "/reportes/ventas" },
    },
    {
      label: "Ventas del mes",
      value: "S/ 284,200",
      variation: "+12.1% vs mes anterior",
      variationColor: "text-success",
      icon: TrendingUp,
      iconColor: "text-success",
      link: { text: "Ver Reporte Ventas →", href: "/reportes/ventas" },
    },
    {
      label: "Tasa de devolución",
      value: "18.4%",
      variationColor: "text-success",
      icon: RotateCcw,
      iconColor: "text-success", // < 20% = green
      link: { text: "Ver Reporte Devoluciones →", href: "/reportes/devoluciones" },
    },
    {
      label: "Cuentas x cobrar vencidas",
      value: "S/ 4,200",
      variationColor: "text-danger",
      icon: AlertCircle,
      iconColor: "text-danger", // always red if > 0
      link: { text: "Ver Reporte CxC →", href: "/reportes/cxc" },
    },
  ];

  const row2: Omit<KpiCardProps, "index">[] = [
    {
      label: "Gastos operativos del mes",
      value: "S/ 23,800",
      sub: "8.4% de las ventas del mes",
      icon: DollarSign,
      iconColor: "text-muted-foreground",
      link: { text: "Ver Reporte Gastos →", href: "/reportes/gastos" },
    },
    {
      label: "Alertas de vencimiento",
      value: "7 activas",
      icon: Bell,
      iconColor: "text-danger", // > 0 = red
      badge: { value: "7", color: "bg-danger text-danger-foreground" },
      link: { text: "Ver alertas →", href: "/vencidos/alertas" },
    },
    {
      label: "Clientes atendidos hoy",
      value: "43",
      variation: "+5 vs ayer",
      variationColor: "text-success",
      icon: Users,
      iconColor: "text-muted-foreground",
    },
    {
      label: "Pedidos pendientes despacho",
      value: "12",
      icon: Truck,
      iconColor: "text-muted-foreground",
      badge: { value: "12", color: "bg-warning text-warning-foreground" },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground text-balance">
            Buenos días, Jorge
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Resumen ejecutivo — Viernes, 20 de marzo 2026
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(v) => v && setPeriod(v as Period)}
          className="bg-card border border-border rounded-lg p-0.5"
        >
          {periods.map((p) => (
            <ToggleGroupItem
              key={p.value}
              value={p.value}
              className={cn(
                "text-xs px-3 h-8 rounded-md font-medium transition-all data-[state=on]:shadow-sm",
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                "data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground"
              )}
            >
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* KPI Row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {row1.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {row2.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i + 4} />
        ))}
      </div>
    </div>
  );
}
