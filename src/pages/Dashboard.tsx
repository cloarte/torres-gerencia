import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  kpiCards,
  ventasSemana,
  ventasPorCategoria,
  pedidosRecientes,
  gastosAprobacion,
} from "@/data/mockDashboard";
import { cn } from "@/lib/utils";

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  warning: Clock,
  danger: AlertTriangle,
};

const trendColors = {
  up: "text-success",
  down: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const estadoBadge: Record<string, { className: string; label: string }> = {
  confirmado: { className: "bg-success/10 text-success border-0", label: "Confirmado" },
  pendiente: { className: "bg-warning/10 text-warning border-0", label: "Pendiente" },
  entregado: { className: "bg-primary/10 text-primary border-0", label: "Entregado" },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-xl font-semibold text-foreground text-balance">
          Buenos días, Jorge
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Resumen ejecutivo — Viernes, 20 de marzo 2026
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, i) => {
          const Icon = trendIcons[kpi.trend];
          return (
            <Card
              key={kpi.label}
              className="shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums">{kpi.value}</p>
                <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trendColors[kpi.trend])}>
                  <Icon className="h-3.5 w-3.5" />
                  <span>{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bar chart */}
        <Card className="lg:col-span-2 shadow-sm animate-fade-in-up" style={{ animationDelay: "320ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Ventas de la Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ventasSemana} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [`S/ ${value.toLocaleString()}`, "Ventas"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                />
                <ReferenceLine y={9000} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "Meta", position: "right", fontSize: 10, fill: "hsl(var(--accent))" }} />
                <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ventasPorCategoria.map((cat) => (
              <div key={cat.categoria}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{cat.categoria}</span>
                  <span className="text-muted-foreground tabular-nums">{cat.monto}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${cat.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent orders */}
        <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "480ms" }}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Pedidos Recientes</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-accent hover:text-accent">
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pedidosRecientes.map((p) => {
                const badge = estadoBadge[p.estado];
                const Icon = p.estado === "entregado" ? Truck : p.estado === "confirmado" ? CheckCircle2 : Clock;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <Icon className={cn("h-4 w-4 shrink-0", badge.className.includes("success") ? "text-success" : badge.className.includes("warning") ? "text-warning" : "text-primary")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.cliente}</p>
                      <p className="text-xs text-muted-foreground">{p.id}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{p.monto}</span>
                    <Badge variant="secondary" className={cn("text-[10px]", badge.className)}>
                      {badge.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Gastos pending approval */}
        <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "560ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Gastos Pendientes de Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gastosAprobacion.map((g) => (
              <div key={g.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{g.concepto}</p>
                    <p className="text-xs text-muted-foreground">{g.id} · {g.solicitante}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{g.monto}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 bg-success hover:bg-success/90 text-success-foreground text-xs">
                    Aprobar
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs text-danger border-danger/30 hover:bg-danger/5">
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
