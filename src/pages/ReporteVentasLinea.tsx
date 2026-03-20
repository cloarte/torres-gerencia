import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const kpis: ReportKpi[] = [
  { label: "Línea mayor ingreso", value: "Panetones", variation: "S/ 98,400" },
  { label: "Línea mayor crecimiento", value: "Empanadas", variation: "+22.1%", positive: true },
  { label: "Línea mayor devolución", value: "Pan de Molde", variation: "18.2%", positive: false },
  { label: "Total líneas activas", value: "5" },
];

const columns: ReportColumn[] = [
  { key: "linea", label: "Línea" },
  { key: "skus", label: "N° SKUs", align: "right" },
  { key: "unidades", label: "Unid. vendidas", align: "right" },
  { key: "monto", label: "Monto S/", align: "right" },
  { key: "participacion", label: "% participación", align: "right", render: (v: number) => `${v.toFixed(1)}%` },
  { key: "devoluciones", label: "Devoluciones", align: "right" },
  { key: "variacion", label: "Variación %", align: "right", render: (v: number) => <span className={v > 0 ? "text-success" : "text-danger"}>{v > 0 ? "+" : ""}{v.toFixed(1)}%</span> },
];

const data = [
  { linea: "Panetones", skus: 8, unidades: 5200, monto: "S/ 98,400", participacion: 42.0, devoluciones: 312, variacion: 14.2 },
  { linea: "Pan de Molde", skus: 12, unidades: 6400, monto: "S/ 65,800", participacion: 28.0, devoluciones: 1165, variacion: 3.8 },
  { linea: "Empanadas", skus: 6, unidades: 3800, monto: "S/ 35,200", participacion: 15.0, devoluciones: 266, variacion: 22.1 },
  { linea: "Tortas", skus: 10, unidades: 1200, monto: "S/ 23,500", participacion: 10.0, devoluciones: 60, variacion: 8.5 },
  { linea: "Kekos", skus: 5, unidades: 2100, monto: "S/ 11,700", participacion: 5.0, devoluciones: 168, variacion: -2.4 },
];

const totalsRow = { linea: "TOTAL", skus: 41, unidades: 18700, monto: "S/ 234,600", participacion: 100.0, devoluciones: 1971, variacion: 11.8 };

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.linea}`,
  columns: [
    { key: "sku", label: "SKU" },
    { key: "nombre", label: "Nombre" },
    { key: "unidades", label: "Unidades", align: "right" },
    { key: "monto", label: "Monto S/", align: "right" },
  ],
  getData: () => [
    { sku: "PT-001", nombre: "Panetón Clásico 1kg", unidades: 4200, monto: "S/ 84,000" },
    { sku: "PT-002", nombre: "Panetón Chocochips 1kg", unidades: 600, monto: "S/ 9,000" },
    { sku: "PT-003", nombre: "Panetón Premium 1.5kg", unidades: 400, monto: "S/ 5,400" },
  ],
};

const pieData = data.map((d) => ({ name: d.linea, value: d.participacion }));
const pieColors = ["hsl(213,52%,24%)", "hsl(213,52%,38%)", "hsl(37,80%,52%)", "hsl(213,40%,55%)", "hsl(37,60%,70%)"];
const barData = data.map((d) => ({ name: d.linea, monto: parseFloat(d.monto.replace(/[^\d]/g, "")) / 100 }));

const chart = (
  <div className="grid gap-4 lg:grid-cols-2">
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Participación por línea</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} strokeWidth={0}>{pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12 }} /></PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
          {pieData.map((d, i) => <div key={d.name} className="flex items-center gap-1.5 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} /><span className="text-muted-foreground">{d.name} {d.value}%</span></div>)}
        </div>
      </CardContent>
    </Card>
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Montos por línea</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={32}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" /><XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} /><Tooltip formatter={(v: number) => [`S/ ${(v * 100).toLocaleString()}`, "Monto"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="monto" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default function ReporteVentasLinea() {
  return <ReportLayout title="Ventas por Línea" kpis={kpis} columns={columns} data={data} totalsRow={totalsRow} chart={chart} drilldown={drilldown} />;
}
