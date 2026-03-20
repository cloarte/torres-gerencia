import {
  TrendingUp,
  AlertCircle,
  Bell,
  Users,
  Truck,
  DollarSign,
  RotateCcw,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Period selector ──────────────────────────────────────────────
type Period = "hoy" | "semana" | "mes" | "anio";
const periods: { value: Period; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "anio", label: "Este año" },
];

// ── KPI Card ─────────────────────────────────────────────────────
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
  label, value, sub, variation, variationColor = "text-success",
  icon: Icon, iconColor = "text-muted-foreground", badge, link, index,
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
            {variation && <p className={cn("text-xs font-medium", variationColor)}>{variation}</p>}
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
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

// ── Mock data: Ventas últimos 30 días ────────────────────────────
function generateVentas30d() {
  const data: { fecha: string; actual: number; anterior: number }[] = [];
  const base = new Date(2026, 2, 20); // March 20
  for (let i = 29; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    data.push({
      fecha: `${day}/${month < 10 ? "0" + month : month}`,
      actual: Math.round(7000 + Math.random() * 8000),
      anterior: Math.round(5500 + Math.random() * 7000),
    });
  }
  return data;
}
const ventas30d = generateVentas30d();

// ── Mock data: Mix de líneas ─────────────────────────────────────
const mixLineas = [
  { name: "Panetones", value: 42 },
  { name: "Pan de Molde", value: 28 },
  { name: "Empanadas", value: 15 },
  { name: "Tortas", value: 10 },
  { name: "Kekos", value: 5 },
];
const pieColors = [
  "hsl(213, 52%, 24%)",   // primary
  "hsl(213, 52%, 38%)",   // primary lighter
  "hsl(37, 80%, 52%)",    // accent
  "hsl(213, 40%, 55%)",   // primary muted
  "hsl(37, 60%, 70%)",    // accent muted
];

// ── Mock data: Top 5 rutas ───────────────────────────────────────
const topRutas = [
  { ruta: "LIM-02", vendedor: "Pedro Soto", despachadas: 340, devueltas: 187, tasa: 55.0 },
  { ruta: "PRV-01", vendedor: "María Torres", despachadas: 210, devueltas: 84, tasa: 40.0 },
  { ruta: "LIM-01", vendedor: "Juan López", despachadas: 280, devueltas: 47, tasa: 16.8 },
  { ruta: "PRV-02", vendedor: "Carlos Ramos", despachadas: 165, devueltas: 29, tasa: 17.6 },
  { ruta: "LIM-03", vendedor: "Ana Gutiérrez", despachadas: 195, devueltas: 22, tasa: 11.3 },
];

// ── Custom tooltip for line chart ────────────────────────────────
const LineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs space-y-1">
      <p className="font-semibold">{label}</p>
      <p className="text-foreground">Este año: <span className="font-bold tabular-nums">S/ {payload[0]?.value?.toLocaleString()}</span></p>
      <p className="text-muted-foreground">Año anterior: <span className="font-bold tabular-nums">S/ {payload[1]?.value?.toLocaleString()}</span></p>
    </div>
  );
};
LineTooltip.displayName = "LineTooltip";

// ── Dashboard ────────────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("mes");

  const row1: Omit<KpiCardProps, "index">[] = [
    {
      label: "Ventas del día", value: "S/ 12,450",
      variation: "+8.3% vs ayer", variationColor: "text-success",
      icon: TrendingUp, iconColor: "text-success",
      link: { text: "Ver Reporte Ventas →", href: "/reportes/ventas" },
    },
    {
      label: "Ventas del mes", value: "S/ 284,200",
      variation: "+12.1% vs mes anterior", variationColor: "text-success",
      icon: TrendingUp, iconColor: "text-success",
      link: { text: "Ver Reporte Ventas →", href: "/reportes/ventas" },
    },
    {
      label: "Tasa de devolución", value: "18.4%",
      icon: RotateCcw, iconColor: "text-success",
      link: { text: "Ver Reporte Devoluciones →", href: "/reportes/devoluciones" },
    },
    {
      label: "Cuentas x cobrar vencidas", value: "S/ 4,200",
      icon: AlertCircle, iconColor: "text-danger",
      link: { text: "Ver Reporte CxC →", href: "/reportes/cxc" },
    },
  ];

  const row2: Omit<KpiCardProps, "index">[] = [
    {
      label: "Gastos operativos del mes", value: "S/ 23,800",
      sub: "8.4% de las ventas del mes",
      icon: DollarSign, iconColor: "text-muted-foreground",
      link: { text: "Ver Reporte Gastos →", href: "/reportes/gastos" },
    },
    {
      label: "Alertas de vencimiento", value: "7 activas",
      icon: Bell, iconColor: "text-danger",
      badge: { value: "7", color: "bg-danger text-danger-foreground" },
      link: { text: "Ver alertas →", href: "/vencidos/alertas" },
    },
    {
      label: "Clientes atendidos hoy", value: "43",
      variation: "+5 vs ayer", variationColor: "text-success",
      icon: Users, iconColor: "text-muted-foreground",
    },
    {
      label: "Pedidos pendientes despacho", value: "12",
      icon: Truck, iconColor: "text-muted-foreground",
      badge: { value: "12", color: "bg-warning text-warning-foreground" },
      link: { text: "Ver pedidos →", href: "/pedidos?filter=LISTO_DESPACHO" },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground text-balance">Buenos días, Jorge</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Resumen ejecutivo — Viernes, 20 de marzo 2026</p>
        </div>
        <ToggleGroup
          type="single" value={period}
          onValueChange={(v) => v && setPeriod(v as Period)}
          className="bg-card border border-border rounded-lg p-0.5"
        >
          {periods.map((p) => (
            <ToggleGroupItem
              key={p.value} value={p.value}
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
        {row1.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} index={i} />)}
      </div>

      {/* KPI Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {row2.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} index={i + 4} />)}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Line chart - 2/3 */}
        <Card className="lg:col-span-2 shadow-sm animate-fade-in-up" style={{ animationDelay: "560ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Ventas últimos 30 días</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ventas30d}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="fecha" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <ReTooltip content={<LineTooltip />} />
                <Legend
                  verticalAlign="top" align="right" iconType="line"
                  wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                />
                <Line
                  type="monotone" dataKey="actual" name="Este año"
                  stroke="hsl(var(--primary))" strokeWidth={2} dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone" dataKey="anterior" name="Año anterior"
                  stroke="hsl(var(--border))" strokeWidth={1.5} strokeDasharray="5 3" dot={false}
                  activeDot={{ r: 3, strokeWidth: 0, fill: "hsl(var(--border))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart - 1/3 */}
        <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "630ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Mix de líneas del mes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mixLineas} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={2} strokeWidth={0}
                >
                  {mixLineas.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <PieTooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {mixLineas.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom table */}
      <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "700ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Top 5 rutas con mayor devolución — últimos 7 días
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Ruta</TableHead>
                <TableHead className="text-xs font-semibold">Vendedor</TableHead>
                <TableHead className="text-xs font-semibold text-right">Unid. despachadas</TableHead>
                <TableHead className="text-xs font-semibold text-right">Unid. devueltas</TableHead>
                <TableHead className="text-xs font-semibold text-right">Tasa %</TableHead>
                <TableHead className="text-xs font-semibold text-center w-14">Ver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topRutas.map((r) => {
                const rowClass = r.tasa > 40
                  ? "bg-danger/5 hover:bg-danger/10"
                  : r.tasa > 20
                    ? "bg-warning/5 hover:bg-warning/10"
                    : "hover:bg-muted/50";
                const tasaColor = r.tasa > 40
                  ? "text-danger font-bold"
                  : r.tasa > 20
                    ? "text-warning font-bold"
                    : "text-foreground";
                return (
                  <TableRow key={r.ruta} className={rowClass}>
                    <TableCell className="text-sm font-medium">{r.ruta}</TableCell>
                    <TableCell className="text-sm">{r.vendedor}</TableCell>
                    <TableCell className="text-sm text-right tabular-nums">{r.despachadas}</TableCell>
                    <TableCell className="text-sm text-right tabular-nums">{r.devueltas}</TableCell>
                    <TableCell className={cn("text-sm text-right tabular-nums", tasaColor)}>
                      {r.tasa.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <a href={`/reportes/devoluciones?ruta=${r.ruta}`}>
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
