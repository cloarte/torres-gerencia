import { useState } from "react";
import {
  Eye,
  CheckCircle,
  X,
  Search,
  SlidersHorizontal,
  Camera,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Types & data ─────────────────────────────────────────────────
interface Lote {
  id: string;
  vendedor: string;
  periodo: string;
  nGastos: number;
  total: number;
  estado: "ENVIADO" | "APROBADO" | "DEVUELTO";
  enviado: string;
  fotos: number;
}

interface GastoDetalle {
  fecha: string;
  tipo: string;
  monto: string;
  descripcion: string;
  tieneComprobante: boolean;
  estadoValidacion: string;
}

const estadoBadges: Record<string, { className: string; label: string }> = {
  ENVIADO: { className: "bg-amber-100 text-amber-700 border-0", label: "Enviado" },
  APROBADO: { className: "bg-green-100 text-green-700 border-0", label: "Aprobado" },
  DEVUELTO: { className: "bg-red-100 text-red-700 border-0", label: "Devuelto" },
};

const tipoBadges: Record<string, string> = {
  COMBUSTIBLE: "bg-orange-100 text-orange-700 border-0",
  PEAJE: "bg-blue-100 text-blue-700 border-0",
  DESCARGA: "bg-purple-100 text-purple-700 border-0",
  VIATICO: "bg-teal-100 text-teal-700 border-0",
  OTRO: "bg-slate-100 text-slate-600 border-0",
};

const initialLotes: Lote[] = [
  { id: "LOT-001", vendedor: "Juan López", periodo: "15-19 Mar", nGastos: 8, total: 842, estado: "ENVIADO", enviado: "hace 2h", fotos: 5 },
  { id: "LOT-002", vendedor: "Pedro Soto", periodo: "15-19 Mar", nGastos: 5, total: 520, estado: "APROBADO", enviado: "hace 1d", fotos: 3 },
  { id: "LOT-003", vendedor: "María Torres", periodo: "08-12 Mar", nGastos: 6, total: 315, estado: "DEVUELTO", enviado: "hace 3d", fotos: 4 },
  { id: "LOT-004", vendedor: "Carlos Ramos", periodo: "15-19 Mar", nGastos: 7, total: 663, estado: "ENVIADO", enviado: "hace 5h", fotos: 6 },
];

const detalleGastos: Record<string, GastoDetalle[]> = {
  "LOT-001": [
    { fecha: "19/03", tipo: "COMBUSTIBLE", monto: "S/ 180", descripcion: "Ruta completa zona norte", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "19/03", tipo: "PEAJE", monto: "S/ 24", descripcion: "Peaje Evitamiento x2", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "18/03", tipo: "COMBUSTIBLE", monto: "S/ 160", descripcion: "Recarga medio tanque", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "18/03", tipo: "VIATICO", monto: "S/ 35", descripcion: "Almuerzo ruta", tieneComprobante: false, estadoValidacion: "PENDIENTE" },
    { fecha: "17/03", tipo: "COMBUSTIBLE", monto: "S/ 195", descripcion: "Tanque lleno + desvío", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "17/03", tipo: "DESCARGA", monto: "S/ 80", descripcion: "Descarga Supermercados Plaza", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "16/03", tipo: "PEAJE", monto: "S/ 12", descripcion: "Peaje Via Expresa", tieneComprobante: false, estadoValidacion: "PENDIENTE" },
    { fecha: "15/03", tipo: "OTRO", monto: "S/ 156", descripcion: "Reparación neumático", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
  ],
  "LOT-002": [
    { fecha: "19/03", tipo: "COMBUSTIBLE", monto: "S/ 200", descripcion: "Tanque completo", tieneComprobante: true, estadoValidacion: "VALIDADO" },
    { fecha: "18/03", tipo: "PEAJE", monto: "S/ 36", descripcion: "Peajes zona sur x3", tieneComprobante: true, estadoValidacion: "VALIDADO" },
    { fecha: "17/03", tipo: "VIATICO", monto: "S/ 40", descripcion: "Almuerzo cliente", tieneComprobante: true, estadoValidacion: "VALIDADO" },
    { fecha: "16/03", tipo: "COMBUSTIBLE", monto: "S/ 180", descripcion: "Recarga ruta", tieneComprobante: false, estadoValidacion: "OBSERVADO" },
    { fecha: "15/03", tipo: "DESCARGA", monto: "S/ 64", descripcion: "Descarga Wong", tieneComprobante: true, estadoValidacion: "VALIDADO" },
  ],
  "LOT-003": [
    { fecha: "12/03", tipo: "COMBUSTIBLE", monto: "S/ 90", descripcion: "Media ruta provincia", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "11/03", tipo: "COMBUSTIBLE", monto: "S/ 85", descripcion: "Recarga parcial", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "10/03", tipo: "PEAJE", monto: "S/ 18", descripcion: "Peaje panamericana", tieneComprobante: false, estadoValidacion: "PENDIENTE" },
    { fecha: "09/03", tipo: "VIATICO", monto: "S/ 32", descripcion: "Almuerzo ruta", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "08/03", tipo: "COMBUSTIBLE", monto: "S/ 65", descripcion: "Ruta corta", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "08/03", tipo: "OTRO", monto: "S/ 25", descripcion: "Estacionamiento mercado", tieneComprobante: false, estadoValidacion: "PENDIENTE" },
  ],
  "LOT-004": [
    { fecha: "19/03", tipo: "COMBUSTIBLE", monto: "S/ 175", descripcion: "Ruta PRV-02 completa", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "18/03", tipo: "PEAJE", monto: "S/ 48", descripcion: "Peajes ida y vuelta provincia", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "18/03", tipo: "VIATICO", monto: "S/ 45", descripcion: "Almuerzo y cena ruta", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "17/03", tipo: "COMBUSTIBLE", monto: "S/ 160", descripcion: "Recarga tanque", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "17/03", tipo: "DESCARGA", monto: "S/ 95", descripcion: "Descarga distribuidora", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
    { fecha: "16/03", tipo: "PEAJE", monto: "S/ 24", descripcion: "Peaje x2", tieneComprobante: false, estadoValidacion: "PENDIENTE" },
    { fecha: "15/03", tipo: "COMBUSTIBLE", monto: "S/ 116", descripcion: "Medio tanque inicio semana", tieneComprobante: true, estadoValidacion: "PENDIENTE" },
  ],
};

const validacionBadges: Record<string, { className: string; label: string }> = {
  PENDIENTE: { className: "bg-slate-100 text-slate-500 border-0", label: "Pendiente" },
  VALIDADO: { className: "bg-green-100 text-green-700 border-0", label: "Validado" },
  OBSERVADO: { className: "bg-amber-100 text-amber-700 border-0", label: "Observado" },
};

// ── Component ────────────────────────────────────────────────────
export default function Gastos() {
  const [lotes, setLotes] = useState(initialLotes);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("ENVIADO");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [approveDialog, setApproveDialog] = useState<Lote | null>(null);
  const [returnDialog, setReturnDialog] = useState<Lote | null>(null);
  const [returnMotivo, setReturnMotivo] = useState("");

  const filtered = lotes.filter((l) => {
    if (search && !l.vendedor.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterEstado && filterEstado !== "ALL" && l.estado !== filterEstado) return false;
    return true;
  });

  const pendientes = lotes.filter((l) => l.estado === "ENVIADO");
  const totalAprobar = pendientes.reduce((s, l) => s + l.total, 0);
  const vendedoresEnviados = new Set(pendientes.map((l) => l.vendedor)).size;

  function handleApprove() {
    if (!approveDialog) return;
    setLotes((prev) =>
      prev.map((l) => (l.id === approveDialog.id ? { ...l, estado: "APROBADO" as const } : l))
    );
    toast.success(`Lote de ${approveDialog.vendedor} aprobado por S/ ${approveDialog.total}`);
    setApproveDialog(null);
  }

  function handleReturn() {
    if (!returnDialog || !returnMotivo.trim()) return;
    setLotes((prev) =>
      prev.map((l) => (l.id === returnDialog.id ? { ...l, estado: "DEVUELTO" as const } : l))
    );
    toast.error(`Lote de ${returnDialog.vendedor} devuelto para corrección`);
    setReturnDialog(null);
    setReturnMotivo("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Aprobación de Gastos</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Los gastos aprobados se descuentan automáticamente en la liquidación del vendedor.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 animate-fade-in-up">
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="text-xs text-amber-600 font-medium">Lotes pendientes</span>
            <p className="text-lg font-bold text-amber-700">{pendientes.length}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Total a aprobar</span>
            <p className="text-lg font-bold text-foreground">S/ {totalAprobar.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Vendedores con lotes enviados</span>
            <p className="text-lg font-bold text-foreground">{vendedoresEnviados}</p>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por vendedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="ENVIADO">Enviado</SelectItem>
            <SelectItem value="APROBADO">Aprobado</SelectItem>
            <SelectItem value="DEVUELTO">Devuelto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "140ms" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Vendedor</TableHead>
                  <TableHead className="text-xs font-semibold">Período</TableHead>
                  <TableHead className="text-xs font-semibold text-right">N° gastos</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Total S/</TableHead>
                  <TableHead className="text-xs font-semibold">Estado</TableHead>
                  <TableHead className="text-xs font-semibold">Enviado</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Fotos</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      No se encontraron lotes con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((lote) => {
                    const badge = estadoBadges[lote.estado];
                    const isEnviado = lote.estado === "ENVIADO";
                    return (
                      <TableRow key={lote.id} className="hover:bg-muted/50">
                        <TableCell className="text-sm font-medium">{lote.vendedor}</TableCell>
                        <TableCell className="text-sm">{lote.periodo}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums">{lote.nGastos}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums font-medium">
                          S/ {lote.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px]", badge.className)}>
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{lote.enviado}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums">
                          <div className="flex items-center justify-end gap-1">
                            <Camera className="h-3 w-3 text-muted-foreground" />
                            <span>{lote.fotos}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost" size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => { setSelectedLote(lote); setSheetOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isEnviado && (
                              <>
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-7 w-7 text-success hover:text-success hover:bg-success/10"
                                  onClick={() => setApproveDialog(lote)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-7 w-7 text-danger hover:text-danger hover:bg-danger/10"
                                  onClick={() => setReturnDialog(lote)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approve AlertDialog */}
      <AlertDialog open={!!approveDialog} onOpenChange={(open) => !open && setApproveDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aprobar lote de gastos?</AlertDialogTitle>
            <AlertDialogDescription>
              Aprobar S/ {approveDialog?.total.toLocaleString()} de gastos de{" "}
              <span className="font-semibold text-foreground">{approveDialog?.vendedor}</span> ({approveDialog?.periodo}).
              El importe será descontado en su próxima liquidación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>Aprobar lote</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return AlertDialog */}
      <AlertDialog open={!!returnDialog} onOpenChange={(open) => { if (!open) { setReturnDialog(null); setReturnMotivo(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Devolver lote para corrección?</AlertDialogTitle>
            <AlertDialogDescription>
              El vendedor deberá corregir y reenviar el lote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Motivo de devolución *</label>
            <Textarea
              placeholder="Describa el motivo de la devolución..."
              value={returnMotivo}
              onChange={(e) => setReturnMotivo(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReturn}
              disabled={!returnMotivo.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Devolver lote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg">
              Detalle de gastos — {selectedLote?.vendedor} — {selectedLote?.periodo}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Fecha</TableHead>
                  <TableHead className="text-xs font-semibold">Tipo</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Monto</TableHead>
                  <TableHead className="text-xs font-semibold">Descripción</TableHead>
                  <TableHead className="text-xs font-semibold">Comprobante</TableHead>
                  <TableHead className="text-xs font-semibold">Validación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedLote &&
                  (detalleGastos[selectedLote.id] || []).map((g, i) => {
                    const tipoCls = tipoBadges[g.tipo] || tipoBadges.OTRO;
                    const valBadge = validacionBadges[g.estadoValidacion] || validacionBadges.PENDIENTE;
                    return (
                      <TableRow key={i}>
                        <TableCell className="text-xs tabular-nums">{g.fecha}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px]", tipoCls)}>
                            {g.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right tabular-nums font-medium">{g.monto}</TableCell>
                        <TableCell className="text-xs max-w-[140px] truncate">{g.descripcion}</TableCell>
                        <TableCell className="text-xs">
                          {g.tieneComprobante ? (
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Sin foto</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px]", valBadge.className)}>
                            {valBadge.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <SheetFooter className="mt-6 flex items-center justify-between">
            <p className="text-sm font-bold">
              Total del lote: S/ {selectedLote?.total.toLocaleString()}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setSheetOpen(false)}>
              Cerrar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
