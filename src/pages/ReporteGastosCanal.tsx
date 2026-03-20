import { ReportLayout, ReportColumn, ReportKpi, DrilldownConfig } from "@/components/ReportLayout";

const kpis: ReportKpi[] = [
  { label: "Total gastos aprobados", value: "S/ 23,800" },
  { label: "Mayor rubro", value: "Combustible", variation: "S/ 8,420" },
  { label: "Ratio gastos/ventas", value: "8.4%", variation: "-0.3%", positive: true },
  { label: "Gastos sin aprobar", value: "S/ 1,842", variation: "3 lotes", positive: false },
];

const columns: ReportColumn[] = [
  { key: "canal", label: "Canal" },
  { key: "ruta", label: "Ruta" },
  { key: "vendedor", label: "Vendedor" },
  { key: "tipo", label: "Tipo gasto" },
  { key: "monto", label: "Monto S/", align: "right" },
  { key: "registros", label: "N° registros", align: "right" },
  { key: "porcentaje", label: "% sobre ventas", align: "right" },
];

const data = [
  { canal: "Tradicional", ruta: "LIM-02", vendedor: "Pedro Soto", tipo: "Combustible", monto: "S/ 3,200", registros: 12, porcentaje: "8.3%" },
  { canal: "Tradicional", ruta: "PRV-01", vendedor: "María Torres", tipo: "Combustible", monto: "S/ 2,800", registros: 10, porcentaje: "9.0%" },
  { canal: "Tradicional", ruta: "LIM-03", vendedor: "Ana Gutiérrez", tipo: "Viáticos", monto: "S/ 1,420", registros: 8, porcentaje: "6.3%" },
  { canal: "Moderno", ruta: "—", vendedor: "Juan López", tipo: "Estacionamiento", monto: "S/ 680", registros: 15, porcentaje: "1.3%" },
  { canal: "Directa", ruta: "PRV-02", vendedor: "Carlos Ramos", tipo: "Peajes", monto: "S/ 540", registros: 6, porcentaje: "2.2%" },
];

const totalsRow = { canal: "TOTAL", ruta: "", vendedor: "", tipo: "", monto: "S/ 8,640", registros: 51, porcentaje: "3.0%" };

const drilldown: DrilldownConfig = {
  title: (row) => `Detalle — ${row.vendedor} — ${row.tipo}`,
  columns: [
    { key: "fecha", label: "Fecha" },
    { key: "descripcion", label: "Descripción" },
    { key: "monto", label: "Monto S/", align: "right" },
  ],
  getData: () => [
    { fecha: "18/03/2026", descripcion: "Combustible ruta completa", monto: "S/ 280" },
    { fecha: "17/03/2026", descripcion: "Recarga medio tanque", monto: "S/ 180" },
    { fecha: "16/03/2026", descripcion: "Combustible ruta + desvío", monto: "S/ 310" },
  ],
};

export default function ReporteGastosCanal() {
  return <ReportLayout title="Gastos por Canal" kpis={kpis} columns={columns} data={data} totalsRow={totalsRow} drilldown={drilldown} />;
}
