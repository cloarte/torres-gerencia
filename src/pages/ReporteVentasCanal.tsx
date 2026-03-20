import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";

const kpis: ReportKpi[] = [
  { label: "Total ventas", value: "S/ 284,200", variation: "+12.1%", positive: true },
  { label: "Canal mayor volumen", value: "Moderno", variation: "S/ 128,400" },
  { label: "Canal mayor crecimiento", value: "Corporativo", variation: "+22.4%", positive: true },
  { label: "Tasa devolución global", value: "18.4%", variation: "-1.2%", positive: true },
];

const tasaColor = (tasa: number) =>
  tasa > 40 ? "text-danger font-bold" : tasa > 20 ? "text-warning font-bold" : "text-success";

const columns: ReportColumn[] = [
  { key: "canal", label: "Canal" },
  { key: "monto", label: "Monto S/", align: "right" },
  { key: "despachadas", label: "Unid. despachadas", align: "right" },
  { key: "devueltas", label: "Devueltas", align: "right" },
  { key: "tasa", label: "Tasa %", align: "right", render: (v) => <span className={tasaColor(v)}>{v.toFixed(1)}%</span> },
  { key: "clientes", label: "Clientes", align: "right" },
  { key: "pedidos", label: "Pedidos", align: "right" },
  { key: "ticket", label: "Ticket S/", align: "right" },
  { key: "variacion", label: "Variación %", align: "right", render: (v) => <span className={v > 0 ? "text-success" : "text-danger"}>{v > 0 ? "+" : ""}{v.toFixed(1)}%</span> },
];

const data = [
  { canal: "Moderno", monto: "S/ 128,400", despachadas: 4200, devueltas: 630, tasa: 15.0, clientes: 18, pedidos: 52, ticket: "S/ 2,469", variacion: 12.1 },
  { canal: "Tradicional", monto: "S/ 89,600", despachadas: 3800, devueltas: 912, tasa: 24.0, clientes: 85, pedidos: 142, ticket: "S/ 631", variacion: 8.3 },
  { canal: "Directa", monto: "S/ 42,100", despachadas: 1500, devueltas: 180, tasa: 12.0, clientes: 12, pedidos: 28, ticket: "S/ 1,504", variacion: -2.5 },
  { canal: "Corporativo", monto: "S/ 24,100", despachadas: 800, devueltas: 48, tasa: 6.0, clientes: 5, pedidos: 14, ticket: "S/ 1,721", variacion: 22.4 },
];

const totalsRow = { canal: "TOTAL", monto: "S/ 284,200", despachadas: 10300, devueltas: 1770, tasa: 17.2, clientes: 120, pedidos: 236, ticket: "S/ 1,204", variacion: 12.1 };

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.canal}`,
  columns: [
    { key: "vendedor", label: "Vendedor" },
    { key: "ventas", label: "Ventas S/", align: "right" },
    { key: "unidades", label: "Unidades", align: "right" },
    { key: "devol", label: "Devoluciones", align: "right" },
  ],
  getData: () => [
    { vendedor: "Juan López", ventas: "S/ 42,800", unidades: 1400, devol: 168 },
    { vendedor: "Pedro Soto", ventas: "S/ 38,200", unidades: 1200, devol: 204 },
    { vendedor: "María Torres", ventas: "S/ 28,600", unidades: 980, devol: 147 },
    { vendedor: "Ana Gutiérrez", ventas: "S/ 18,800", unidades: 620, devol: 111 },
  ],
};

const barData = data.map((d) => ({ name: d.canal, monto: parseFloat(d.monto.replace(/[^\d]/g, "")) / 100 }));
const pieData = data.map((d) => ({ name: d.canal, value: parseFloat(d.monto.replace(/[^\d]/g, "")) }));
const pieColors = ["hsl(213,52%,24%)", "hsl(37,80%,52%)", "hsl(213,40%,55%)", "hsl(37,60%,70%)"];

const chart = (
  <div className="grid gap-4 lg:grid-cols-3">
    <Card className="lg:col-span-2 shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Monto por canal</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
            <Tooltip formatter={(v: number) => [`S/ ${(v * 100).toLocaleString()}`, "Monto"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="monto" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Participación por canal</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} strokeWidth={0}>
              {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
            </Pie>
            <Tooltip formatter={(v: number) => [`S/ ${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
              <span className="text-muted-foreground">{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function ReporteVentasCanal() {
  return (
    <ReportLayout
      title="Ventas por Canal"
      kpis={kpis}
      columns={columns}
      data={data}
      totalsRow={totalsRow}
      chart={chart}
      drilldown={drilldown}
    />
  );
}
