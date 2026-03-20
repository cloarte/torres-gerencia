import { useState } from "react";
import { Gift, Tag, Trash2, Eye, Package, AlertTriangle, Clock, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PoolItem {
  id: string;
  producto: string;
  lote: string;
  cantidad: number;
  condicion: "VENCIDO" | "PRÓXIMO_VENCER" | "DEFECTO_ESTÉTICO";
  diasRestantes: number;
  valor: number;
  precioUnitario: number;
  recibidoDe: string;
  ingreso: string;
}

const initialItems: PoolItem[] = [
  { id: "1", producto: "Panetón Clásico 900g", lote: "L-2026-008", cantidad: 48, condicion: "VENCIDO", diasRestantes: -2, valor: 600, precioUnitario: 12.5, recibidoDe: "Juan López", ingreso: "18 Mar 2026" },
  { id: "2", producto: "Pan de Molde Blanco", lote: "L-2026-009", cantidad: 24, condicion: "PRÓXIMO_VENCER", diasRestantes: 3, valor: 96, precioUnitario: 4.0, recibidoDe: "Retorno LIM-01", ingreso: "17 Mar 2026" },
  { id: "3", producto: "Empanada Pollo x12", lote: "L-2026-007", cantidad: 15, condicion: "PRÓXIMO_VENCER", diasRestantes: 5, valor: 150, precioUnitario: 10.0, recibidoDe: "Pedro Soto", ingreso: "15 Mar 2026" },
  { id: "4", producto: "Panetón Chocolate 900g", lote: "L-2026-006", cantidad: 30, condicion: "DEFECTO_ESTÉTICO", diasRestantes: 22, valor: 420, precioUnitario: 14.0, recibidoDe: "Inspector Calidad", ingreso: "10 Mar 2026" },
  { id: "5", producto: "Torta Tres Leches 1kg", lote: "L-2026-010", cantidad: 8, condicion: "VENCIDO", diasRestantes: -1, valor: 200, precioUnitario: 25.0, recibidoDe: "Retorno PRV-01", ingreso: "19 Mar 2026" },
];

const beneficiarios = [
  { id: "b1", nombre: "Comedor Popular San Martín", isPerceptorSunat: true },
  { id: "b2", nombre: "Albergue Niños del Sol", isPerceptorSunat: true },
  { id: "b3", nombre: "Parroquia Santa Rosa", isPerceptorSunat: false },
  { id: "b4", nombre: "ONG Alimenta Perú", isPerceptorSunat: true },
];

const clientes = [
  "Bodega La Esquina", "Minimarket Central", "Panadería Don José",
  "Distribuidora Lima Sur", "Market Express",
];

const condicionBadge: Record<string, string> = {
  VENCIDO: "bg-red-100 text-red-700 border-red-200",
  PRÓXIMO_VENCER: "bg-amber-100 text-amber-700 border-amber-200",
  DEFECTO_ESTÉTICO: "bg-orange-100 text-orange-700 border-orange-200",
};

const condicionLabel: Record<string, string> = {
  VENCIDO: "Vencido",
  PRÓXIMO_VENCER: "Próximo a vencer",
  DEFECTO_ESTÉTICO: "Defecto estético",
};

export default function VencidosPool() {
  const [items, setItems] = useState<PoolItem[]>(initialItems);

  // Donar dialog
  const [donarOpen, setDonarOpen] = useState(false);
  const [donarItem, setDonarItem] = useState<PoolItem | null>(null);
  const [donarBeneficiario, setDonarBeneficiario] = useState("");
  const [donarCantidad, setDonarCantidad] = useState("");
  const [donarNotas, setDonarNotas] = useState("");

  // Venta especial dialog
  const [ventaOpen, setVentaOpen] = useState(false);
  const [ventaItem, setVentaItem] = useState<PoolItem | null>(null);
  const [ventaCliente, setVentaCliente] = useState("");
  const [ventaCantidad, setVentaCantidad] = useState("");
  const [ventaDescuento, setVentaDescuento] = useState("");
  const [ventaObs, setVentaObs] = useState("");
  const [clientePopoverOpen, setClientePopoverOpen] = useState(false);

  // Merma dialog
  const [mermaOpen, setMermaOpen] = useState(false);
  const [mermaItem, setMermaItem] = useState<PoolItem | null>(null);
  const [mermaMotivo, setMermaMotivo] = useState("");

  // Detail sheet
  const [detailItem, setDetailItem] = useState<PoolItem | null>(null);

  // Summaries
  const totalItems = items.length;
  const valorTotal = items.reduce((s, i) => s + i.valor, 0);
  const yaVencidos = items.filter((i) => i.condicion === "VENCIDO").length;
  const aptosDonacion = items.filter((i) => i.diasRestantes >= 0 && i.diasRestantes <= 5).length;

  const openDonar = (item: PoolItem) => {
    setDonarItem(item);
    setDonarBeneficiario("");
    setDonarCantidad(String(item.cantidad));
    setDonarNotas("");
    setDonarOpen(true);
  };

  const confirmDonar = () => {
    if (!donarBeneficiario || !donarCantidad) return;
    setItems((prev) => prev.filter((i) => i.id !== donarItem?.id));
    toast.success(`Donación registrada: ${donarItem?.producto} → ${beneficiarios.find((b) => b.id === donarBeneficiario)?.nombre}`);
    setDonarOpen(false);
  };

  const openVenta = (item: PoolItem) => {
    setVentaItem(item);
    setVentaCliente("");
    setVentaCantidad(String(item.cantidad));
    setVentaDescuento("30");
    setVentaObs("");
    setVentaOpen(true);
  };

  const confirmVenta = () => {
    if (!ventaCliente || !ventaCantidad || !ventaDescuento) return;
    setItems((prev) => prev.filter((i) => i.id !== ventaItem?.id));
    toast.success(`Orden especial creada: ${ventaItem?.producto} → ${ventaCliente}`);
    setVentaOpen(false);
  };

  const openMerma = (item: PoolItem) => {
    setMermaItem(item);
    setMermaMotivo("");
    setMermaOpen(true);
  };

  const confirmMerma = () => {
    if (!mermaMotivo) return;
    setItems((prev) => prev.filter((i) => i.id !== mermaItem?.id));
    toast.success(`Merma registrada: ${mermaItem?.cantidad} uds. de ${mermaItem?.producto}`);
    setMermaOpen(false);
  };

  const selectedBeneficiario = beneficiarios.find((b) => b.id === donarBeneficiario);
  const ventaPrecioFinal = ventaItem
    ? (ventaItem.precioUnitario * (1 - (Number(ventaDescuento) || 0) / 100)).toFixed(2)
    : "0.00";

  const formatDias = (dias: number) => {
    if (dias < 0) return `(Vencido hace ${Math.abs(dias)} día${Math.abs(dias) > 1 ? "s" : ""})`;
    if (dias === 0) return "Hoy";
    return `${dias} día${dias > 1 ? "s" : ""}`;
  };

  const diasClass = (dias: number) => {
    if (dias <= 0) return "text-destructive font-bold";
    if (dias <= 5) return "text-destructive font-bold";
    if (dias <= 15) return "text-amber-600 font-medium";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pool de Decisión — Productos Pendientes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Productos retornados o detectados por vencer que requieren tu decisión de destino.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total en pool</p>
              <p className="text-xl font-bold tabular-nums">{totalItems} ítems</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valor total</p>
              <p className="text-xl font-bold tabular-nums">S/ {valorTotal.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ya vencidos</p>
              <p className="text-xl font-bold tabular-nums text-destructive">{yaVencidos} ítems</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Aptos donación (≤5 días)</p>
              <p className="text-xl font-bold tabular-nums text-amber-600">{aptosDonacion} ítems</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Producto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Condición</TableHead>
                <TableHead>Días restantes</TableHead>
                <TableHead className="text-right">Valor S/</TableHead>
                <TableHead>Recibido de</TableHead>
                <TableHead>Ingreso</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.producto}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{item.lote}</TableCell>
                  <TableCell className="text-right tabular-nums">{item.cantidad}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[11px]", condicionBadge[item.condicion])}>
                      {condicionLabel[item.condicion]}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("text-sm tabular-nums", diasClass(item.diasRestantes))}>
                    {formatDias(item.diasRestantes)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">S/ {item.valor.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{item.recibidoDe}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.ingreso}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailItem(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalle</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-teal-600 hover:text-teal-700" onClick={() => openDonar(item)}>
                            <Gift className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Donar</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700" onClick={() => openVenta(item)}>
                            <Tag className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Venta especial</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={() => openMerma(item)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Descartar como merma</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No hay productos pendientes de decisión.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===== DONAR DIALOG ===== */}
      <Dialog open={donarOpen} onOpenChange={setDonarOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-teal-600" />
              Registrar Donación
            </DialogTitle>
            <DialogDescription>
              {donarItem?.producto} — {donarItem?.cantidad} uds. disponibles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Beneficiario *</Label>
              <Select value={donarBeneficiario} onValueChange={setDonarBeneficiario}>
                <SelectTrigger><SelectValue placeholder="Seleccionar beneficiario" /></SelectTrigger>
                <SelectContent>
                  {beneficiarios.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBeneficiario?.isPerceptorSunat && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
                  <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px]">✓ Perceptor SUNAT</Badge>
                  Donación deducible de IR
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Cantidad a donar *</Label>
              <Input
                type="number"
                min={1}
                max={donarItem?.cantidad}
                value={donarCantidad}
                onChange={(e) => setDonarCantidad(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                placeholder="Observaciones opcionales..."
                value={donarNotas}
                onChange={(e) => setDonarNotas(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDonarOpen(false)}>Cancelar</Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={!donarBeneficiario || !donarCantidad}
              onClick={confirmDonar}
            >
              Registrar donación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== VENTA ESPECIAL DIALOG ===== */}
      <Dialog open={ventaOpen} onOpenChange={setVentaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              Crear Orden Especial con Descuento
            </DialogTitle>
            <DialogDescription>
              {ventaItem?.producto} — Precio original: S/ {ventaItem?.precioUnitario.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Popover open={clientePopoverOpen} onOpenChange={setClientePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    {ventaCliente || "Buscar cliente..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." />
                    <CommandList>
                      <CommandEmpty>Sin resultados.</CommandEmpty>
                      <CommandGroup>
                        {clientes.map((c) => (
                          <CommandItem
                            key={c}
                            onSelect={() => {
                              setVentaCliente(c);
                              setClientePopoverOpen(false);
                            }}
                          >
                            {c}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad *</Label>
                <Input
                  type="number"
                  min={1}
                  max={ventaItem?.cantidad}
                  value={ventaCantidad}
                  onChange={(e) => setVentaCantidad(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descuento % *</Label>
                <Input
                  type="number"
                  min={0}
                  max={90}
                  value={ventaDescuento}
                  onChange={(e) => setVentaDescuento(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="text-sm text-blue-700">
                Precio final c/descuento:{" "}
                <span className="font-bold text-lg">S/ {ventaPrecioFinal}</span>
                <span className="text-xs ml-2">por unidad</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="Observaciones opcionales..."
                value={ventaObs}
                onChange={(e) => setVentaObs(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVentaOpen(false)}>Cancelar</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!ventaCliente || !ventaCantidad || !ventaDescuento}
              onClick={confirmVenta}
            >
              Crear orden especial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== MERMA ALERT DIALOG ===== */}
      <AlertDialog open={mermaOpen} onOpenChange={setMermaOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Registrar como merma?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción registrará {mermaItem?.cantidad} unidades de {mermaItem?.producto} como
              pérdida por valor de S/ {mermaItem?.valor.toLocaleString()}. No se puede revertir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2 space-y-2">
            <Label>Motivo *</Label>
            <Select value={mermaMotivo} onValueChange={setMermaMotivo}>
              <SelectTrigger><SelectValue placeholder="Seleccionar motivo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="VENCIDO">Vencido</SelectItem>
                <SelectItem value="DAÑADO">Dañado</SelectItem>
                <SelectItem value="DECISION_GG">Decisión GG</SelectItem>
                <SelectItem value="STOCK_FLOTANTE_VENCIDO">Stock flotante vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!mermaMotivo}
              onClick={confirmMerma}
            >
              Registrar merma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== DETAIL SHEET ===== */}
      <Sheet open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Detalle — {detailItem?.producto}</SheetTitle>
            <SheetDescription>Lote {detailItem?.lote}</SheetDescription>
          </SheetHeader>
          {detailItem && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Condición</p>
                  <Badge variant="outline" className={cn("text-[11px]", condicionBadge[detailItem.condicion])}>
                    {condicionLabel[detailItem.condicion]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Días restantes</p>
                  <p className={cn("text-sm font-medium", diasClass(detailItem.diasRestantes))}>
                    {formatDias(detailItem.diasRestantes)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cantidad</p>
                  <p className="text-sm font-medium">{detailItem.cantidad} uds.</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Valor total</p>
                  <p className="text-sm font-medium">S/ {detailItem.valor.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Precio unitario</p>
                  <p className="text-sm font-medium">S/ {detailItem.precioUnitario.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Recibido de</p>
                  <p className="text-sm font-medium">{detailItem.recibidoDe}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fecha ingreso</p>
                  <p className="text-sm font-medium">{detailItem.ingreso}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" size="sm" onClick={() => { setDetailItem(null); openDonar(detailItem); }}>
                  <Gift className="h-4 w-4 mr-1" /> Donar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm" onClick={() => { setDetailItem(null); openVenta(detailItem); }}>
                  <Tag className="h-4 w-4 mr-1" /> Venta especial
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { setDetailItem(null); openMerma(detailItem); }}>
                  <Trash2 className="h-4 w-4 mr-1" /> Merma
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
