import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Eye,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ── Status badge config ──────────────────────────────────────────
const estadoBadges: Record<string, { className: string; label: string }> = {
  PENDIENTE: { className: "bg-amber-100 text-amber-700 border-0", label: "Pendiente" },
  CONFIRMADO: { className: "bg-blue-100 text-blue-700 border-0", label: "Confirmado" },
  LISTO_DESPACHO: { className: "bg-green-100 text-green-700 border-0", label: "Listo Despacho" },
  CANCELADO: { className: "bg-red-100 text-red-700 border-0", label: "Cancelado" },
  RECHAZADO: { className: "bg-slate-100 text-slate-500 border-0", label: "Rechazado" },
};

const origenBadges: Record<string, { className: string; label: string }> = {
  INTERNO: { className: "bg-purple-100 text-purple-700 border-0", label: "Interno" },
  PORTAL: { className: "bg-teal-100 text-teal-700 border-0", label: "Portal" },
};

const canalBadges: Record<string, string> = {
  Tradicional: "bg-orange-100 text-orange-700 border-0",
  Moderno: "bg-sky-100 text-sky-700 border-0",
  Directa: "bg-emerald-100 text-emerald-700 border-0",
  Corporativo: "bg-indigo-100 text-indigo-700 border-0",
};

// ── Mock data ────────────────────────────────────────────────────
interface Pedido {
  id: string;
  cliente: string;
  canal: string;
  ruta: string | null;
  fechaEntrega: string;
  estado: string;
  total: string;
  origen: string;
  creadoPor: string;
}

const mockPedidos: Pedido[] = [
  { id: "PED-2026-0042", cliente: "Bodega San Martín", canal: "Tradicional", ruta: "LIM-01", fechaEntrega: "20/01/2026", estado: "PENDIENTE", total: "S/ 480.00", origen: "PORTAL", creadoPor: "(portal)" },
  { id: "PED-2026-0041", cliente: "Supermercados Plaza", canal: "Moderno", ruta: null, fechaEntrega: "20/01/2026", estado: "CONFIRMADO", total: "S/ 1,850.00", origen: "INTERNO", creadoPor: "Juan López" },
  { id: "PED-2026-0040", cliente: "Distribuidora Lima", canal: "Directa", ruta: null, fechaEntrega: "19/01/2026", estado: "LISTO_DESPACHO", total: "S/ 3,200.00", origen: "INTERNO", creadoPor: "Pedro Soto" },
  { id: "PED-2026-0039", cliente: "Restaurant El Buen", canal: "Corporativo", ruta: null, fechaEntrega: "19/01/2026", estado: "CANCELADO", total: "S/ 950.00", origen: "PORTAL", creadoPor: "(portal)" },
  { id: "PED-2026-0038", cliente: "Bodega La Cruz", canal: "Tradicional", ruta: "PRV-01", fechaEntrega: "18/01/2026", estado: "CONFIRMADO", total: "S/ 720.00", origen: "INTERNO", creadoPor: "María Torres" },
  { id: "PED-2026-0037", cliente: "Minimarket Sol", canal: "Tradicional", ruta: "LIM-02", fechaEntrega: "18/01/2026", estado: "PENDIENTE", total: "S/ 1,120.00", origen: "INTERNO", creadoPor: "Ana Gutiérrez" },
  { id: "PED-2026-0036", cliente: "Wong Cencosud", canal: "Moderno", ruta: null, fechaEntrega: "17/01/2026", estado: "LISTO_DESPACHO", total: "S/ 5,600.00", origen: "INTERNO", creadoPor: "Juan López" },
  { id: "PED-2026-0035", cliente: "Tiendas Mass", canal: "Moderno", ruta: null, fechaEntrega: "17/01/2026", estado: "CONFIRMADO", total: "S/ 2,340.00", origen: "PORTAL", creadoPor: "(portal)" },
  { id: "PED-2026-0034", cliente: "Bodega Rosita", canal: "Tradicional", ruta: "PRV-02", fechaEntrega: "16/01/2026", estado: "RECHAZADO", total: "S/ 310.00", origen: "INTERNO", creadoPor: "Carlos Ramos" },
  { id: "PED-2026-0033", cliente: "Panadería Central", canal: "Directa", ruta: null, fechaEntrega: "16/01/2026", estado: "PENDIENTE", total: "S/ 1,480.00", origen: "INTERNO", creadoPor: "Pedro Soto" },
];

const estados = ["PENDIENTE", "CONFIRMADO", "LISTO_DESPACHO", "CANCELADO", "RECHAZADO"];
const canales = ["Tradicional", "Moderno", "Directa", "Corporativo"];
const origenes = ["INTERNO", "PORTAL"];

export default function Pedidos() {
  const [searchParams] = useSearchParams();
  const initialEstado = searchParams.get("filter") || "";

  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState(initialEstado);
  const [filterCanal, setFilterCanal] = useState("");
  const [filterOrigen, setFilterOrigen] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockPedidos.filter((p) => {
      if (search) {
        const s = search.toLowerCase();
        if (!p.id.toLowerCase().includes(s) && !p.cliente.toLowerCase().includes(s)) return false;
      }
      if (filterEstado && p.estado !== filterEstado) return false;
      if (filterCanal && p.canal !== filterCanal) return false;
      if (filterOrigen && p.origen !== filterOrigen) return false;
      return true;
    });
  }, [search, filterEstado, filterCanal, filterOrigen]);

  const hasFilters = filterEstado || filterCanal || filterOrigen;

  function clearFilters() {
    setFilterEstado("");
    setFilterCanal("");
    setFilterOrigen("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Pedidos</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Vista de supervisión — solo lectura
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por N° pedido o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
              <X className="h-3 w-3 mr-1" /> Limpiar filtros
            </Button>
          )}
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                Filtros
                {hasFilters && (
                  <Badge className="ml-1.5 h-4 min-w-4 px-1 text-[10px] bg-accent text-accent-foreground border-0 rounded-full">
                    {[filterEstado, filterCanal, filterOrigen].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 space-y-3">
              <p className="text-xs font-semibold text-foreground">Filtrar pedidos</p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Estado</label>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {estados.map((e) => (
                      <SelectItem key={e} value={e}>{estadoBadges[e].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Canal</label>
                <Select value={filterCanal} onValueChange={setFilterCanal}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {canales.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Origen</label>
                <Select value={filterOrigen} onValueChange={setFilterOrigen}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {origenes.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Button size="sm" className="w-full h-8 text-xs" onClick={() => setFiltersOpen(false)}>
                Aplicar
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-sm animate-fade-in-up">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">N° Pedido</TableHead>
                  <TableHead className="text-xs font-semibold">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold">Canal</TableHead>
                  <TableHead className="text-xs font-semibold">Ruta</TableHead>
                  <TableHead className="text-xs font-semibold">Fecha entrega</TableHead>
                  <TableHead className="text-xs font-semibold">Estado</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Total c/IGV</TableHead>
                  <TableHead className="text-xs font-semibold">Origen</TableHead>
                  <TableHead className="text-xs font-semibold">Creado por</TableHead>
                  <TableHead className="text-xs font-semibold text-center w-14">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-sm text-muted-foreground">
                      No se encontraron pedidos con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => {
                    const estado = estadoBadges[p.estado];
                    const origen = origenBadges[p.origen];
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="text-sm font-medium">{p.id}</TableCell>
                        <TableCell className="text-sm">{p.cliente}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px]", canalBadges[p.canal])}>
                            {p.canal}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {p.ruta || "—"}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">{p.fechaEntrega}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px]", estado.className)}>
                            {estado.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-right tabular-nums">{p.total}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px]", origen.className)}>
                            {origen.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.creadoPor}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" asChild>
                            <Link to={`/pedidos/${p.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Mostrando {filtered.length} de {mockPedidos.length} pedidos
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 min-w-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
