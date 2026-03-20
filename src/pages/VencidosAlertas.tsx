import { useState, useMemo } from "react";
import { Eye, ArrowRight, Search, Filter, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Alerta {
  id: string;
  producto: string;
  lote: string;
  cliente: string;
  canal: "Tradicional" | "Moderno" | "Corporativo" | "Directa";
  ruta: string | null;
  venceEl: string;
  diasRestantes: number;
  tipo: "ALERTA_ROJA" | "ALERTA_AMARILLA";
}

const initialData: Alerta[] = [
  { id: "1", producto: "Pan de Molde Blanco", lote: "L-2026-009", cliente: "Bodega San Martín", canal: "Tradicional", ruta: "LIM-01", venceEl: "23/03", diasRestantes: 3, tipo: "ALERTA_ROJA" },
  { id: "2", producto: "Empanada Pollo x12", lote: "L-2026-007", cliente: "Minimarket El Sol", canal: "Tradicional", ruta: "LIM-02", venceEl: "25/03", diasRestantes: 5, tipo: "ALERTA_ROJA" },
  { id: "3", producto: "Panetón Clásico 900g", lote: "L-2026-005", cliente: "Supermercados Plaza", canal: "Moderno", ruta: null, venceEl: "27/03", diasRestantes: 7, tipo: "ALERTA_ROJA" },
  { id: "4", producto: "Torta Tres Leches 1kg", lote: "L-2026-004", cliente: "Restaurant El Buen Sabor", canal: "Corporativo", ruta: null, venceEl: "30/03", diasRestantes: 10, tipo: "ALERTA_AMARILLA" },
  { id: "5", producto: "Panetón Chocolate 900g", lote: "L-2026-003", cliente: "Distribuidora Lima", canal: "Directa", ruta: null, venceEl: "03/04", diasRestantes: 14, tipo: "ALERTA_AMARILLA" },
];

const alertaBadge: Record<string, string> = {
  ALERTA_ROJA: "bg-red-100 text-red-700 border-red-200",
  ALERTA_AMARILLA: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const alertaLabel: Record<string, string> = {
  ALERTA_ROJA: "Alerta roja",
  ALERTA_AMARILLA: "Alerta amarilla",
};

export default function VencidosAlertas() {
  const [items, setItems] = useState<Alerta[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterCanal, setFilterCanal] = useState<string>("all");
  const [filterRuta, setFilterRuta] = useState<string>("all");
  const [filterDiasMax, setFilterDiasMax] = useState<number[]>([15]);
  const [detailItem, setDetailItem] = useState<Alerta | null>(null);

  const redCount = items.filter((i) => i.tipo === "ALERTA_ROJA").length;

  const rutas = useMemo(() => {
    const r = new Set(items.filter((i) => i.ruta).map((i) => i.ruta!));
    return Array.from(r);
  }, [items]);

  const filtered = useMemo(() => {
    return items
      .filter((i) => {
        if (search) {
          const s = search.toLowerCase();
          if (!i.producto.toLowerCase().includes(s) && !i.cliente.toLowerCase().includes(s)) return false;
        }
        if (filterTipo !== "all" && i.tipo !== filterTipo) return false;
        if (filterCanal !== "all" && i.canal !== filterCanal) return false;
        if (filterRuta !== "all" && (i.ruta || "—") !== filterRuta) return false;
        if (i.diasRestantes > filterDiasMax[0]) return false;
        return true;
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [items, search, filterTipo, filterCanal, filterRuta, filterDiasMax]);

  const applyRedFilter = () => {
    setFilterTipo("ALERTA_ROJA");
  };

  const sendToPool = (item: Alerta) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success(`${item.producto} (${item.lote}) enviado al Pool de Decisión`);
  };

  const diasClass = (dias: number) => {
    if (dias <= 5) return "text-destructive font-bold";
    if (dias <= 7) return "text-destructive font-medium";
    if (dias <= 10) return "text-amber-600 font-medium";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Alertas de Vencimiento</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Productos próximos a vencer que requieren seguimiento o acción.
        </p>
      </div>

      {/* Red alert banner */}
      {redCount > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">
            <span className="mr-1.5">🔴</span>
            Hay <span className="font-bold">{redCount}</span> productos en alerta roja (≤7 días). Requieren acción inmediata.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-100"
            onClick={applyRedFilter}
          >
            Ver solo alertas rojas
          </Button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por producto o cliente..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filtros
              {(filterTipo !== "all" || filterCanal !== "all" || filterRuta !== "all" || filterDiasMax[0] < 15) && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-4" align="start">
            <div className="space-y-2">
              <Label className="text-xs">Tipo alerta</Label>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="ALERTA_ROJA">Alerta roja</SelectItem>
                  <SelectItem value="ALERTA_AMARILLA">Alerta amarilla</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Canal</Label>
              <Select value={filterCanal} onValueChange={setFilterCanal}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Tradicional">Tradicional</SelectItem>
                  <SelectItem value="Moderno">Moderno</SelectItem>
                  <SelectItem value="Corporativo">Corporativo</SelectItem>
                  <SelectItem value="Directa">Directa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filterCanal === "Tradicional" && (
              <div className="space-y-2">
                <Label className="text-xs">Ruta</Label>
                <Select value={filterRuta} onValueChange={setFilterRuta}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {rutas.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs">Días restantes (máx: {filterDiasMax[0]})</Label>
              <Slider min={0} max={15} step={1} value={filterDiasMax} onValueChange={setFilterDiasMax} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => { setFilterTipo("all"); setFilterCanal("all"); setFilterRuta("all"); setFilterDiasMax([15]); }}
            >
              Limpiar filtros
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Cliente asignado</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Vence el</TableHead>
                <TableHead>Días restantes</TableHead>
                <TableHead>Alerta</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className={item.tipo === "ALERTA_ROJA" ? "bg-red-50/40" : ""}>
                  <TableCell className="font-medium">{item.producto}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{item.lote}</TableCell>
                  <TableCell className="text-sm">{item.cliente}</TableCell>
                  <TableCell className="text-sm">{item.canal}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.ruta || "—"}</TableCell>
                  <TableCell className="text-sm tabular-nums">{item.venceEl}</TableCell>
                  <TableCell className={cn("text-sm tabular-nums", diasClass(item.diasRestantes))}>
                    {item.diasRestantes} días
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[11px]", alertaBadge[item.tipo])}>
                      {alertaLabel[item.tipo]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailItem(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver trazabilidad</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary/80"
                            onClick={() => sendToPool(item)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Enviar al pool</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No hay alertas que coincidan con los filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Trazabilidad — {detailItem?.producto}</SheetTitle>
            <SheetDescription>Lote {detailItem?.lote}</SheetDescription>
          </SheetHeader>
          {detailItem && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cliente asignado</p>
                  <p className="text-sm font-medium">{detailItem.cliente}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Canal / Ruta</p>
                  <p className="text-sm font-medium">{detailItem.canal}{detailItem.ruta ? ` — ${detailItem.ruta}` : ""}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fecha vencimiento</p>
                  <p className="text-sm font-medium">{detailItem.venceEl}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Días restantes</p>
                  <p className={cn("text-sm font-medium", diasClass(detailItem.diasRestantes))}>
                    {detailItem.diasRestantes} días
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Alerta</p>
                  <Badge variant="outline" className={cn("text-[11px]", alertaBadge[detailItem.tipo])}>
                    {alertaLabel[detailItem.tipo]}
                  </Badge>
                </div>
              </div>

              {/* Mock timeline */}
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Historial del lote</p>
                <div className="space-y-3">
                  {[
                    { fecha: "10 Mar", evento: "Producción completada", detalle: "Lote registrado en almacén" },
                    { fecha: "12 Mar", evento: "Despacho a ruta", detalle: `Asignado a ${detailItem.canal}${detailItem.ruta ? ` — ${detailItem.ruta}` : ""}` },
                    { fecha: "14 Mar", evento: "Entrega a cliente", detalle: detailItem.cliente },
                    { fecha: "18 Mar", evento: "Alerta generada", detalle: `${detailItem.diasRestantes} días para vencimiento` },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("h-2 w-2 rounded-full mt-1.5", i === 3 ? "bg-destructive" : "bg-primary")} />
                        {i < 3 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-xs text-muted-foreground">{step.fecha}</p>
                        <p className="text-sm font-medium">{step.evento}</p>
                        <p className="text-xs text-muted-foreground">{step.detalle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  onClick={() => { sendToPool(detailItem); setDetailItem(null); }}
                >
                  <ArrowRight className="h-4 w-4 mr-1" /> Enviar al pool
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDetailItem(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
