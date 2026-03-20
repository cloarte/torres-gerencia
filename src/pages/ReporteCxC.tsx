import { Badge } from "@/components/ui/badge";
import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";
import { cn } from "@/lib/utils";

const estadoBadges: Record<string, { className: string; label: string }> = {
  VIGENTE: { className: "bg-green-100 text-green-700 border-0", label: "Vigente" },
  POR_VENCER: { className: "bg-amber-100 text-amber-700 border-0", label: "Por vencer" },
  VENCIDO: { className: "bg-red-100 text-red-700 border-0", label: "Vencido" },
};

const kpis: ReportKpi[] = [
  { label: "Total pendiente", value: "S/ 42,600" },
  { label: "Vencido", value: "S/ 4,200", variation: "3 clientes", positive: false },
  { label: "Por vencer (7 días)", value: "S/ 8,400", variation: "5 clientes", positive: false },
  { label: "Al día", value: "S/ 30,000", variation: "12 clientes", positive: true },
];

const columns: ReportColumn[] = [
  { key: "cliente", label: "Cliente" },
  { key: "canal", label: "Canal" },
  { key: "fechaEntrega", label: "Fecha entrega" },
  { key: "monto", label: "Monto S/", align: "right" },
  { key: "diasCredito", label: "Días crédito", align: "right" },
  { key: "diasVencido", label: "Días vencido", align: "right", render: (v: number) => <span className={v > 0 ? "text-danger font-bold" : ""}>{v}</span> },
  { key: "estado", label: "Estado", render: (v: string) => { const b = estadoBadges[v]; return b ? <Badge variant="secondary" className={cn("text-[10px]", b.className)}>{b.label}</Badge> : v; } },
];

const data = [
  { cliente: "Bodega San Martín", canal: "Tradicional", fechaEntrega: "05/03/2026", monto: "S/ 1,480", diasCredito: 15, diasVencido: 0, estado: "VIGENTE" },
  { cliente: "Restaurant El Buen", canal: "Corporativo", fechaEntrega: "28/02/2026", monto: "S/ 2,200", diasCredito: 30, diasVencido: 0, estado: "POR_VENCER" },
  { cliente: "Distribuidora Lima", canal: "Directa", fechaEntrega: "10/02/2026", monto: "S/ 4,200", diasCredito: 15, diasVencido: 23, estado: "VENCIDO" },
  { cliente: "Supermercados Plaza", canal: "Moderno", fechaEntrega: "15/03/2026", monto: "S/ 8,400", diasCredito: 30, diasVencido: 0, estado: "POR_VENCER" },
  { cliente: "Wong Cencosud", canal: "Moderno", fechaEntrega: "18/03/2026", monto: "S/ 12,600", diasCredito: 45, diasVencido: 0, estado: "VIGENTE" },
];

const totalsRow = { cliente: "TOTAL", canal: "", fechaEntrega: "", monto: "S/ 28,880", diasCredito: "", diasVencido: "", estado: "" };

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.cliente}`,
  columns: [
    { key: "pedido", label: "Pedido" },
    { key: "fecha", label: "Fecha" },
    { key: "monto", label: "Monto S/", align: "right" },
    { key: "pagado", label: "Pagado", align: "right" },
  ],
  getData: () => [
    { pedido: "PED-2026-0042", fecha: "05/03/2026", monto: "S/ 480", pagado: "S/ 0" },
    { pedido: "PED-2026-0035", fecha: "28/02/2026", monto: "S/ 1,000", pagado: "S/ 500" },
  ],
};

export default function ReporteCxC() {
  return <ReportLayout title="Cuentas por Cobrar" kpis={kpis} columns={columns} data={data} totalsRow={totalsRow} drilldown={drilldown} />;
}
