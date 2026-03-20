import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

const causaBadges: Record<string, string> = {
  VENCIDO: "bg-red-100 text-red-700 border-0",
  DEFECTO_ESTETICO: "bg-orange-100 text-orange-700 border-0",
  RECHAZO_CLIENTE: "bg-amber-100 text-amber-700 border-0",
  SOBRESTOCK: "bg-sky-100 text-sky-700 border-0",
};

const kpis: ReportKpi[] = [
  { label: "Tasa devolución global", value: "18.4%", variation: "-1.2% vs anterior", positive: true },
  { label: "Canal mayor devolución", value: "Tradicional", variation: "24.0%" },
  { label: "Causa principal", value: "Vencido", variation: "42% de devoluciones" },
  { label: "Unidades devueltas", value: "1,770", variation: "+3.2%", positive: false },
];

const columns: ReportColumn[] = [
  { key: "canal", label: "Canal" },
  { key: "ruta", label: "Ruta" },
  { key: "despachadas", label: "Unid. despachadas", align: "right" },
  { key: "devueltas", label: "Devueltas", align: "right" },
  { key: "tasa", label: "Tasa %", align: "right", render: (v: number) => <span className={v > 40 ? "text-danger font-bold" : v > 20 ? "text-warning font-bold" : "text-success"}>{v.toFixed(1)}%</span> },
  { key: "causa", label: "Causa principal", render: (v: string) => <Badge variant="secondary" className={cn("text-[10px]", causaBadges[v] || "")}>{v.replace("_", " ")}</Badge> },
  { key: "topSku", label: "Top SKU" },
  { key: "tendencia", label: "Tendencia", align: "center", render: (v: string) => <span className={v === "↑" ? "text-danger" : "text-success"}>{v}</span> },
];

const data = [
  { canal: "Tradicional", ruta: "LIM-02", despachadas: 1640, devueltas: 394, tasa: 24.0, causa: "VENCIDO", topSku: "Pan Molde Integral", tendencia: "↑" },
  { canal: "Tradicional", ruta: "PRV-01", despachadas: 1320, devueltas: 264, tasa: 20.0, causa: "RECHAZO_CLIENTE", topSku: "Empanada Pollo x6", tendencia: "↓" },
  { canal: "Tradicional", ruta: "LIM-01", despachadas: 840, devueltas: 134, tasa: 16.0, causa: "SOBRESTOCK", topSku: "Panetón Clásico 1kg", tendencia: "↓" },
  { canal: "Moderno", ruta: "—", despachadas: 4200, devueltas: 630, tasa: 15.0, causa: "DEFECTO_ESTETICO", topSku: "Keko Vainilla 400g", tendencia: "↓" },
  { canal: "Directa", ruta: "—", despachadas: 1500, devueltas: 180, tasa: 12.0, causa: "VENCIDO", topSku: "Pan Molde Blanco", tendencia: "↑" },
  { canal: "Corporativo", ruta: "—", despachadas: 800, devueltas: 48, tasa: 6.0, causa: "RECHAZO_CLIENTE", topSku: "Torta Chocolate", tendencia: "↓" },
];

const rowClassName = (row: any) =>
  row.tasa > 40 ? "bg-danger/5 hover:bg-danger/10" : row.tasa > 20 ? "bg-warning/5 hover:bg-warning/10" : "hover:bg-muted/50";

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.canal} ${row.ruta !== "—" ? row.ruta : ""}`,
  columns: [
    { key: "sku", label: "SKU" },
    { key: "nombre", label: "Producto" },
    { key: "devueltas", label: "Devueltas", align: "right" },
    { key: "causa", label: "Causa" },
  ],
  getData: () => [
    { sku: "PM-012", nombre: "Pan Molde Integral 600g", devueltas: 124, causa: "VENCIDO" },
    { sku: "PM-010", nombre: "Pan Molde Blanco 600g", devueltas: 86, causa: "DEFECTO_ESTETICO" },
    { sku: "EM-005", nombre: "Empanada Pollo x6", devueltas: 48, causa: "RECHAZO_CLIENTE" },
  ],
};

const trendData = Array.from({ length: 12 }, (_, i) => ({
  mes: ["Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar"][i],
  tradicional: 28 - i * 0.5 + Math.random() * 4,
  moderno: 18 - i * 0.3 + Math.random() * 3,
}));

const chart = (
  <Card className="shadow-sm">
    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Evolución tasa de devolución por canal</CardTitle></CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v.toFixed(0)}%`} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v.toFixed(1)}%`, ""]} />
          <Legend verticalAlign="top" align="right" iconType="line" wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="tradicional" name="Tradicional" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="moderno" name="Moderno" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default function ReporteDevoluciones() {
  return <ReportLayout title="Devoluciones por Canal / Ruta" kpis={kpis} columns={columns} data={data} chart={chart} drilldown={drilldown} rowClassName={rowClassName} />;
}
