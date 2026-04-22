import { useState } from "react";
import { AlertCircle, DownloadCloud, FileText, SlidersHorizontal, X, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UiTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

interface SobrestockRow {
  ruta: string;
  vendedor: string;
  zona: "Lima" | "Provincias";
  periodo: string;
  promSobrestock: number;
  valorProm: number;
  pctSobreDespacho: number;
  tasaRetorno: number;
  costoOportunidad: number;
}

const data: SobrestockRow[] = [
  { ruta: "LIM-01", vendedor: "Pedro Soto", zona: "Lima", periodo: "Mar 2026", promSobrestock: 35.2, valorProm: 352, pctSobreDespacho: 18.4, tasaRetorno: 62.3, costoOportunidad: 1240 },
  { ruta: "LIM-02", vendedor: "María Torres", zona: "Lima", periodo: "Mar 2026", promSobrestock: 42.8, valorProm: 428, pctSobreDespacho: 26.1, tasaRetorno: 74.5, costoOportunidad: 1840 },
  { ruta: "LIM-03", vendedor: "Juan López", zona: "Lima", periodo: "Mar 2026", promSobrestock: 18.6, valorProm: 186, pctSobreDespacho: 12.3, tasaRetorno: 44.2, costoOportunidad: 520 },
  { ruta: "PRV-01", vendedor: "Carlos Ramos", zona: "Provincias", periodo: "Mar 2026", promSobrestock: 58.4, valorProm: 584, pctSobreDespacho: 31.2, tasaRetorno: 78.9, costoOportunidad: 2840 },
  { ruta: "PRV-02", vendedor: "Ana Gutiérrez", zona: "Provincias", periodo: "Mar 2026", promSobrestock: 36.8, valorProm: 368, pctSobreDespacho: 22.8, tasaRetorno: 66.1, costoOportunidad: 1800 },
];

// chart mock — last 30 days
const chartData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 30 + Math.sin(i / 4) * 8 + (i / 30) * 6;
  const pct = 18 + Math.sin(i / 5) * 5 + (i / 30) * 3;
  return {
    fecha: `${String(day).padStart(2, "0")}/03`,
    actual: Math.round(base * 10) / 10,
    pct: Math.round(pct * 10) / 10,
    anterior: Math.round((base - 4 + Math.cos(i / 3) * 3) * 10) / 10,
  };
});

const pctColor = (p: number) =>
  p < 15 ? "text-success" : p <= 25 ? "text-warning" : "text-danger";

const retornoColor = (p: number) =>
  p < 40 ? "text-success" : p <= 70 ? "text-warning" : "text-danger";

const skuDetail = [
  { sku: "SKU-001", producto: "Panetón Clásico 900g", promSobrestock: 18.4, promVendido: 6.2, conversion: 33.7, perdido: 720 },
  { sku: "SKU-002", producto: "Pan de Molde Blanco 500g", promSobrestock: 12.6, promVendido: 4.8, conversion: 38.1, perdido: 312 },
  { sku: "SKU-003", producto: "Empanada Pollo x12", promSobrestock: 8.2, promVendido: 2.1, conversion: 25.6, perdido: 244 },
];

export default function RutasSobrestock() {
  const [granularidad, setGranularidad] = useState("Mes");
  const [compare, setCompare] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<SobrestockRow | null>(null);

  function openDetail(row: SobrestockRow) {
    setSelected(row);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Reporte de Sobrestock por Ruta</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Canal Tradicional — Análisis histórico para minimizar sobrestock operativo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <DownloadCloud className="h-3.5 w-3.5 mr-1.5" /> Exportar Excel
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Período:</span>
              <Badge variant="secondary" className="text-xs">Últimos 30 días</Badge>
            </div>
            <ToggleGroup
              type="single"
              value={granularidad}
              onValueChange={(v) => v && setGranularidad(v)}
              size="sm"
              className="h-8"
            >
              <ToggleGroupItem value="Año" className="text-xs h-7 px-2">Año</ToggleGroupItem>
              <ToggleGroupItem value="Mes" className="text-xs h-7 px-2">Mes</ToggleGroupItem>
              <ToggleGroupItem value="Semana" className="text-xs h-7 px-2">Semana</ToggleGroupItem>
              <ToggleGroupItem value="Día" className="text-xs h-7 px-2">Día</ToggleGroupItem>
            </ToggleGroup>
            <Select>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Ruta" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="LIM-01">LIM-01</SelectItem>
                <SelectItem value="LIM-02">LIM-02</SelectItem>
                <SelectItem value="LIM-03">LIM-03</SelectItem>
                <SelectItem value="PRV-01">PRV-01</SelectItem>
                <SelectItem value="PRV-02">PRV-02</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Vendedor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="Pedro Soto">Pedro Soto</SelectItem>
                <SelectItem value="María Torres">María Torres</SelectItem>
                <SelectItem value="Juan López">Juan López</SelectItem>
                <SelectItem value="Carlos Ramos">Carlos Ramos</SelectItem>
                <SelectItem value="Ana Gutiérrez">Ana Gutiérrez</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 ml-auto">
              <Switch id="compare" checked={compare} onCheckedChange={setCompare} />
              <Label htmlFor="compare" className="text-xs text-muted-foreground cursor-pointer">
                Comparar vs período anterior
              </Label>
            </div>
            <Button size="sm" className="h-8 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" /> Aplicar
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
              <X className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Promedio sobrestock</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">38.4 unid./ruta/día</p>
            <p className="mt-1 text-xs font-medium text-danger">↗ +4.2 vs período anterior</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Valor promedio en camiones</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">S/ 386 /ruta/día</p>
            <p className="mt-1 text-xs font-medium text-danger">↗ +S/ 42 vs anterior</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">% sobrestock sobre despacho</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-warning">22.6%</p>
            <p className="mt-1 text-xs text-muted-foreground">De cada 100 unidades despachadas, 23 regresan</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Tasa retorno sobrestock</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-warning">68.4%</p>
            <p className="mt-1 text-xs text-muted-foreground">Del sobrestock cargado, este % regresa a planta</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Costo de oportunidad estimado</p>
              <UiTooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-slate-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">
                  Calculado como: unidades retornadas × precio promedio de venta
                </TooltipContent>
              </UiTooltip>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">S/ 8,240 / mes</p>
            <p className="mt-1 text-xs text-muted-foreground">Ventas potenciales perdidas por sobrestock mal distribuido</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Tendencia de sobrestock promedio — últimos 30 días</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine
                yAxisId="right"
                y={15}
                stroke="hsl(var(--danger))"
                strokeDasharray="4 4"
                label={{ value: "Objetivo <15%", position: "insideTopRight", fontSize: 10, fill: "hsl(var(--danger))" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="actual"
                name="Sobrestock promedio (unid.)"
                stroke="#1E3A5F"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pct"
                name="% sobre despacho"
                stroke="#E8A020"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
              {compare && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="anterior"
                  name="Período anterior"
                  stroke="rgb(203,213,225)"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Ruta</TableHead>
                <TableHead className="text-xs font-semibold">Vendedor</TableHead>
                <TableHead className="text-xs font-semibold">Zona</TableHead>
                <TableHead className="text-xs font-semibold">Período</TableHead>
                <TableHead className="text-xs font-semibold text-right">Prom. sobrestock unid.</TableHead>
                <TableHead className="text-xs font-semibold text-right">Valor prom. S/</TableHead>
                <TableHead className="text-xs font-semibold text-right">% sobre despacho</TableHead>
                <TableHead className="text-xs font-semibold text-right">Tasa retorno %</TableHead>
                <TableHead className="text-xs font-semibold text-right">Costo oportunidad S/</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.ruta} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(row)}>
                  <TableCell className="text-sm font-semibold text-[#1E3A5F]">{row.ruta}</TableCell>
                  <TableCell className="text-sm">{row.vendedor}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs font-normal",
                        row.zona === "Lima"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                      )}
                    >
                      {row.zona}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.periodo}</TableCell>
                  <TableCell className="text-sm text-right tabular-nums">{row.promSobrestock.toFixed(1)}</TableCell>
                  <TableCell className="text-sm text-right tabular-nums">S/ {row.valorProm}</TableCell>
                  <TableCell className={cn("text-sm text-right tabular-nums font-semibold", pctColor(row.pctSobreDespacho))}>
                    {row.pctSobreDespacho.toFixed(1)}%
                  </TableCell>
                  <TableCell className={cn("text-sm text-right tabular-nums font-semibold", retornoColor(row.tasaRetorno))}>
                    {row.tasaRetorno.toFixed(1)}%
                  </TableCell>
                  <TableCell className={cn("text-sm text-right tabular-nums", row.costoOportunidad > 1000 && "text-danger font-semibold")}>
                    S/ {row.costoOportunidad.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/60 hover:bg-muted/60 font-semibold">
                <TableCell className="text-sm">PROMEDIO</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell className="text-sm text-right tabular-nums">38.4</TableCell>
                <TableCell className="text-sm text-right tabular-nums">S/ 386</TableCell>
                <TableCell className="text-sm text-right tabular-nums">22.6%</TableCell>
                <TableCell className="text-sm text-right tabular-nums">65.2%</TableCell>
                <TableCell className="text-sm text-right tabular-nums">S/ 8,240/mes</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drill-down sheet */}
      {selected && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-lg">
                Detalle sobrestock — {selected.ruta} — {selected.periodo}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">SKU</TableHead>
                    <TableHead className="text-xs">Producto</TableHead>
                    <TableHead className="text-xs text-right">Prom. sobrestock</TableHead>
                    <TableHead className="text-xs text-right">Prom. vendido sobrestock</TableHead>
                    <TableHead className="text-xs text-right">Tasa conversión %</TableHead>
                    <TableHead className="text-xs text-right">Valor perdido S/</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skuDetail.map((s) => (
                    <TableRow key={s.sku}>
                      <TableCell className="text-xs text-slate-400 font-mono">{s.sku}</TableCell>
                      <TableCell className="text-sm">{s.producto}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums">{s.promSobrestock.toFixed(1)}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums">{s.promVendido.toFixed(1)}</TableCell>
                      <TableCell className="text-sm text-right tabular-nums">{s.conversion.toFixed(1)}%</TableCell>
                      <TableCell className="text-sm text-right tabular-nums text-danger font-semibold">
                        S/ {s.perdido.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <SheetFooter className="mt-6 flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <DownloadCloud className="h-3.5 w-3.5 mr-1.5" /> Exportar detalle
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSheetOpen(false)}>
                Cerrar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
