import { Badge } from "@/components/ui/badge";
import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";
import { cn } from "@/lib/utils";

const lineaBadges: Record<string, string> = {
  Panetones: "bg-amber-100 text-amber-700 border-0",
  "Pan de Molde": "bg-sky-100 text-sky-700 border-0",
  Empanadas: "bg-emerald-100 text-emerald-700 border-0",
  Tortas: "bg-purple-100 text-purple-700 border-0",
  Kekos: "bg-rose-100 text-rose-700 border-0",
};

const tasaColor = (t: number) => t > 40 ? "text-danger font-bold" : t > 20 ? "text-warning font-bold" : "text-success";

const kpis: ReportKpi[] = [
  { label: "Producto más vendido (unid)", value: "Panetón Clásico 1kg", variation: "4,200 unid" },
  { label: "Mayor ingreso", value: "Panetón Clásico 1kg", variation: "S/ 84,000" },
  { label: "Mayor devolución %", value: "Pan Molde Integral", variation: "32.4%", positive: false },
  { label: "SKUs activos", value: "48" },
];

const columns: ReportColumn[] = [
  { key: "sku", label: "SKU" },
  { key: "nombre", label: "Nombre" },
  { key: "linea", label: "Línea", render: (v: string) => <Badge variant="secondary" className={cn("text-[10px]", lineaBadges[v] || "bg-muted")}>{v}</Badge> },
  { key: "unidades", label: "Unid. vendidas", align: "right" },
  { key: "monto", label: "Monto S/", align: "right" },
  { key: "devoluciones", label: "Devoluciones", align: "right" },
  { key: "tasa", label: "Tasa %", align: "right", render: (v: number) => <span className={tasaColor(v)}>{v.toFixed(1)}%</span> },
  { key: "ticket", label: "Ticket S/", align: "right" },
  { key: "variacion", label: "Variación %", align: "right", render: (v: number) => <span className={v > 0 ? "text-success" : "text-danger"}>{v > 0 ? "+" : ""}{v.toFixed(1)}%</span> },
];

const data = [
  { sku: "PT-001", nombre: "Panetón Clásico 1kg", linea: "Panetones", unidades: 4200, monto: "S/ 84,000", devoluciones: 252, tasa: 6.0, ticket: "S/ 20.00", variacion: 15.2 },
  { sku: "PM-010", nombre: "Pan Molde Blanco 600g", linea: "Pan de Molde", unidades: 3100, monto: "S/ 21,700", devoluciones: 341, tasa: 11.0, ticket: "S/ 7.00", variacion: 4.8 },
  { sku: "PM-012", nombre: "Pan Molde Integral 600g", linea: "Pan de Molde", unidades: 1800, monto: "S/ 14,400", devoluciones: 583, tasa: 32.4, ticket: "S/ 8.00", variacion: -5.2 },
  { sku: "EM-005", nombre: "Empanada Pollo x6", linea: "Empanadas", unidades: 2400, monto: "S/ 28,800", devoluciones: 168, tasa: 7.0, ticket: "S/ 12.00", variacion: 18.6 },
  { sku: "TO-003", nombre: "Torta Chocolate 1kg", linea: "Tortas", unidades: 620, monto: "S/ 24,800", devoluciones: 31, tasa: 5.0, ticket: "S/ 40.00", variacion: 8.1 },
  { sku: "KE-002", nombre: "Keko Vainilla 400g", linea: "Kekos", unidades: 1450, monto: "S/ 10,150", devoluciones: 116, tasa: 8.0, ticket: "S/ 7.00", variacion: -1.3 },
];

const totalsRow = { sku: "", nombre: "TOTAL", linea: "", unidades: 13570, monto: "S/ 183,850", devoluciones: 1491, tasa: 11.0, ticket: "S/ 13.55", variacion: 10.2 };

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.nombre}`,
  columns: [
    { key: "canal", label: "Canal" },
    { key: "ruta", label: "Ruta" },
    { key: "unidades", label: "Unidades", align: "right" },
    { key: "monto", label: "Monto S/", align: "right" },
  ],
  getData: () => [
    { canal: "Moderno", ruta: "—", unidades: 1800, monto: "S/ 36,000" },
    { canal: "Tradicional", ruta: "LIM-01", unidades: 1200, monto: "S/ 24,000" },
    { canal: "Directa", ruta: "—", unidades: 800, monto: "S/ 16,000" },
    { canal: "Corporativo", ruta: "—", unidades: 400, monto: "S/ 8,000" },
  ],
};

export default function ReporteVentasProducto() {
  return <ReportLayout title="Ventas por Producto" kpis={kpis} columns={columns} data={data} totalsRow={totalsRow} drilldown={drilldown} />;
}
