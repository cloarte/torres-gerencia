import { useState } from "react";
import { ChevronDown, ChevronRight, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface RouteProduct {
  sku: string;
  producto: string;
  cargado: number;
  vendido: number;
  disponible: number;
  valor: number;
}

interface RouteData {
  ruta: string;
  vendedor: string;
  salida: string;
  zona: "Lima" | "Provincias";
  productos: RouteProduct[];
}

const routes: RouteData[] = [
  {
    ruta: "LIM-01",
    vendedor: "Pedro Soto",
    salida: "06:30",
    zona: "Lima",
    productos: [
      { sku: "SKU-001", producto: "Panetón Clásico 900g", cargado: 40, vendido: 12, disponible: 28, valor: 350 },
      { sku: "SKU-002", producto: "Pan de Molde Blanco 500g", cargado: 30, vendido: 18, disponible: 12, valor: 48 },
      { sku: "SKU-003", producto: "Empanada Pollo x12", cargado: 20, vendido: 8, disponible: 12, valor: 120 },
    ],
  },
  {
    ruta: "LIM-02",
    vendedor: "María Torres",
    salida: "06:45",
    zona: "Lima",
    productos: [
      { sku: "SKU-001", producto: "Panetón Clásico 900g", cargado: 50, vendido: 10, disponible: 40, valor: 500 },
      { sku: "SKU-004", producto: "Torta Tres Leches 1kg", cargado: 15, vendido: 9, disponible: 6, valor: 150 },
    ],
  },
  {
    ruta: "LIM-03",
    vendedor: "Juan López",
    salida: "07:00",
    zona: "Lima",
    productos: [
      { sku: "SKU-002", producto: "Pan de Molde Blanco 500g", cargado: 25, vendido: 20, disponible: 5, valor: 20 },
      { sku: "SKU-003", producto: "Empanada Pollo x12", cargado: 18, vendido: 14, disponible: 4, valor: 40 },
    ],
  },
  {
    ruta: "PRV-01",
    vendedor: "Carlos Ramos",
    salida: "05:00",
    zona: "Provincias",
    productos: [
      { sku: "SKU-001", producto: "Panetón Clásico 900g", cargado: 80, vendido: 45, disponible: 35, valor: 437 },
      { sku: "SKU-005", producto: "Keko Vainilla 300g", cargado: 40, vendido: 22, disponible: 18, valor: 90 },
      { sku: "SKU-002", producto: "Pan de Molde Blanco 500g", cargado: 30, vendido: 18, disponible: 12, valor: 48 },
    ],
  },
  {
    ruta: "PRV-02",
    vendedor: "Ana Gutiérrez",
    salida: "05:30",
    zona: "Provincias",
    productos: [
      { sku: "SKU-003", producto: "Empanada Pollo x12", cargado: 35, vendido: 30, disponible: 5, valor: 50 },
      { sku: "SKU-004", producto: "Torta Tres Leches 1kg", cargado: 20, vendido: 17, disponible: 3, valor: 75 },
    ],
  },
];

const dispColor = (n: number) =>
  n > 30 ? "text-red-600" : n >= 15 ? "text-amber-600" : "text-slate-700";

function RouteCard({ route }: { route: RouteData }) {
  const [open, setOpen] = useState(false);
  const totalDisp = route.productos.reduce((s, p) => s + p.disponible, 0);
  const totalCargado = route.productos.reduce((s, p) => s + p.cargado, 0);
  const totalVendido = route.productos.reduce((s, p) => s + p.vendido, 0);
  const totalValor = route.productos.reduce((s, p) => s + p.valor, 0);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors text-left">
            {open ? (
              <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 transition-transform" />
            )}
            <span className="text-base font-bold text-[#1E3A5F]">{route.ruta}</span>
            <span className="text-sm text-slate-700">{route.vendedor}</span>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded px-2 py-0.5 text-xs font-normal">
              Salida {route.salida}
            </Badge>
            <Badge
              className={cn(
                "text-xs rounded px-2 font-normal",
                route.zona === "Lima"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-100"
              )}
            >
              {route.zona}
            </Badge>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs rounded-full px-2 font-normal">
              EN RUTA
            </Badge>
            <span className="ml-auto text-xs text-slate-500">
              Sobrestock disponible: {totalDisp} unid. · S/ {totalValor.toLocaleString()}
            </span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Detalle de sobrestock en camión</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs h-9">SKU</TableHead>
                  <TableHead className="text-xs h-9">Producto</TableHead>
                  <TableHead className="text-xs h-9 text-right">Cant. cargada sobrestock</TableHead>
                  <TableHead className="text-xs h-9 text-right">Cant. vendida en ruta</TableHead>
                  <TableHead className="text-xs h-9 text-right">Cant. disponible en camión</TableHead>
                  <TableHead className="text-xs h-9 text-right">Valor S/ (disponible)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {route.productos.map((p) => (
                  <TableRow key={p.sku}>
                    <TableCell className="text-xs text-slate-400 font-mono py-2">{p.sku}</TableCell>
                    <TableCell className="text-sm py-2">{p.producto}</TableCell>
                    <TableCell className="text-sm py-2 text-right tabular-nums">{p.cargado}</TableCell>
                    <TableCell className="text-sm py-2 text-right tabular-nums">{p.vendido}</TableCell>
                    <TableCell className={cn("text-sm py-2 text-right tabular-nums font-semibold", dispColor(p.disponible))}>
                      {p.disponible}
                    </TableCell>
                    <TableCell className="text-sm py-2 text-right tabular-nums">S/ {p.valor.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-100 hover:bg-slate-100 font-bold">
                  <TableCell colSpan={2} className="text-sm py-2">TOTAL</TableCell>
                  <TableCell className="text-sm py-2 text-right tabular-nums">{totalCargado}</TableCell>
                  <TableCell className="text-sm py-2 text-right tabular-nums">{totalVendido}</TableCell>
                  <TableCell className="text-sm py-2 text-right tabular-nums">{totalDisp}</TableCell>
                  <TableCell className="text-sm py-2 text-right tabular-nums">S/ {totalValor.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function RutasEstado() {
  const totalUnid = routes.reduce((s, r) => s + r.productos.reduce((a, p) => a + p.disponible, 0), 0);
  const totalValor = routes.reduce((s, r) => s + r.productos.reduce((a, p) => a + p.valor, 0), 0);
  const altoCount = routes.filter((r) => r.productos.reduce((a, p) => a + p.disponible, 0) > 30).length;

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const todayCap = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Truck className="h-6 w-6 text-[#1E3A5F]" />
            Estado de Rutas
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Rutas activas hoy — Canal Tradicional. Se muestra hasta que el camión regrese a planta.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs h-7 self-start">{todayCap}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 border rounded-lg p-4">
        <div>
          <p className="text-xs text-muted-foreground">Rutas activas ahora</p>
          <p className="text-2xl font-bold text-[#1E3A5F]">{routes.length}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total unidades sobrestock</p>
          <p className="text-2xl font-bold text-[#1E3A5F]">{totalUnid} unidades</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Valor total en camiones</p>
          <p className="text-2xl font-bold text-[#1E3A5F]">S/ {totalValor.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Rutas con sobrestock alto</p>
          <p className="text-2xl font-bold text-amber-600">{altoCount}</p>
        </div>
      </div>

      <div className="space-y-3">
        {routes.map((r) => (
          <RouteCard key={r.ruta} route={r} />
        ))}
      </div>
    </div>
  );
}
