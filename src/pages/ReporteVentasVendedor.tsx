import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";

const kpis: ReportKpi[] = [
  { label: "Total vendedores activos", value: "12" },
  { label: "Mejor vendedor (S/)", value: "Juan López", variation: "S/ 52,400" },
  { label: "Mayor crecimiento", value: "Ana Gutiérrez", variation: "+28.3%", positive: true },
  { label: "Mayor devolución", value: "Pedro Soto", variation: "24.1%", positive: false },
];

const columns: ReportColumn[] = [
  { key: "vendedor", label: "Vendedor" },
  { key: "canal", label: "Canal" },
  { key: "ruta", label: "Ruta" },
  { key: "ventas", label: "Ventas S/", align: "right" },
  { key: "unidades", label: "Unidades", align: "right" },
  { key: "devoluciones", label: "Devoluciones S/", align: "right" },
  { key: "gastos", label: "Gastos S/", align: "right" },
  { key: "ventaNeta", label: "Venta neta", align: "right" },
  { key: "comision", label: "Comisión", align: "center", render: () => <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground border-0">No disponible — Release 2</Badge> },
  { key: "meta", label: "Meta %", align: "center", render: (v: number) => v > 0 ? <div className="flex items-center gap-2"><Progress value={v} className="h-2 w-16" /><span className="text-xs tabular-nums">{v}%</span></div> : <span className="text-xs text-muted-foreground">Sin meta</span> },
];

const data = [
  { vendedor: "Juan López", canal: "Moderno", ruta: "—", ventas: "S/ 52,400", unidades: 1720, devoluciones: "S/ 4,200", gastos: "S/ 3,800", ventaNeta: "S/ 44,400", meta: 92 },
  { vendedor: "Pedro Soto", canal: "Tradicional", ruta: "LIM-02", ventas: "S/ 38,600", unidades: 1640, devoluciones: "S/ 9,300", gastos: "S/ 4,100", ventaNeta: "S/ 25,200", meta: 78 },
  { vendedor: "María Torres", canal: "Tradicional", ruta: "PRV-01", ventas: "S/ 31,200", unidades: 1320, devoluciones: "S/ 5,600", gastos: "S/ 2,900", ventaNeta: "S/ 22,700", meta: 85 },
  { vendedor: "Carlos Ramos", canal: "Directa", ruta: "PRV-02", ventas: "S/ 24,800", unidades: 880, devoluciones: "S/ 2,100", gastos: "S/ 1,800", ventaNeta: "S/ 20,900", meta: 0 },
  { vendedor: "Ana Gutiérrez", canal: "Tradicional", ruta: "LIM-03", ventas: "S/ 22,400", unidades: 950, devoluciones: "S/ 1,800", gastos: "S/ 2,200", ventaNeta: "S/ 18,400", meta: 110 },
];

const totalsRow = { vendedor: "TOTAL", canal: "", ruta: "", ventas: "S/ 169,400", unidades: 6510, devoluciones: "S/ 23,000", gastos: "S/ 14,800", ventaNeta: "S/ 131,600", meta: -1 };

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.vendedor}`,
  columns: [
    { key: "fecha", label: "Fecha" },
    { key: "ventas", label: "Ventas S/", align: "right" },
    { key: "unidades", label: "Unidades", align: "right" },
    { key: "devol", label: "Devol. S/", align: "right" },
  ],
  getData: () => [
    { fecha: "20/03/2026", ventas: "S/ 2,840", unidades: 92, devol: "S/ 180" },
    { fecha: "19/03/2026", ventas: "S/ 3,120", unidades: 104, devol: "S/ 420" },
    { fecha: "18/03/2026", ventas: "S/ 2,560", unidades: 86, devol: "S/ 0" },
    { fecha: "17/03/2026", ventas: "S/ 2,980", unidades: 98, devol: "S/ 240" },
    { fecha: "16/03/2026", ventas: "S/ 1,900", unidades: 64, devol: "S/ 60" },
  ],
};

export default function ReporteVentasVendedor() {
  return <ReportLayout title="Ventas por Vendedor y Ruta" kpis={kpis} columns={columns} data={data} totalsRow={totalsRow} drilldown={drilldown} />;
}
