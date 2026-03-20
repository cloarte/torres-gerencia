import { useState, ReactNode } from "react";
import {
  DownloadCloud,
  FileText,
  Bookmark,
  X,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────
export interface ReportKpi {
  label: string;
  value: string;
  variation?: string;
  positive?: boolean;
}

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: any, row: any) => ReactNode;
}

export interface DrilldownConfig {
  title: (row: any) => string;
  columns: ReportColumn[];
  getData: (row: any) => any[];
}

interface ReportLayoutProps {
  title: string;
  kpis: ReportKpi[];
  columns: ReportColumn[];
  data: any[];
  totalsRow?: Record<string, any>;
  chart?: ReactNode;
  drilldown?: DrilldownConfig;
  rowClassName?: (row: any) => string;
  extraFilters?: ReactNode;
}

// ── KPI Card ─────────────────────────────────────────────────────
function KpiCard({ kpi, index }: { kpi: ReportKpi; index: number }) {
  const hasVariation = kpi.variation !== undefined;
  return (
    <Card
      className="shadow-sm animate-fade-in-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {kpi.label}
        </p>
        <p className="mt-2 text-2xl font-bold tabular-nums leading-none">{kpi.value}</p>
        {hasVariation && (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              kpi.positive ? "text-success" : "text-danger"
            )}
          >
            {kpi.positive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{kpi.variation}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Layout ──────────────────────────────────────────────────
export function ReportLayout({
  title,
  kpis,
  columns,
  data,
  totalsRow,
  chart,
  drilldown,
  rowClassName,
  extraFilters,
}: ReportLayoutProps) {
  const [compare, setCompare] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [canal, setCanal] = useState("");
  const [vendedor, setVendedor] = useState("");

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleRowClick(row: any) {
    if (!drilldown) return;
    setSelectedRow(row);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Período: 01/01/2026 — 20/03/2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <DownloadCloud className="h-3.5 w-3.5 mr-1.5" />
            Exportar Excel
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Exportar PDF
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
            Guardar config
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Período:</span>
              <Badge variant="secondary" className="text-xs">01/01/2026 — 20/03/2026</Badge>
            </div>
            <Select value={canal} onValueChange={setCanal}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="Tradicional">Tradicional</SelectItem>
                <SelectItem value="Moderno">Moderno</SelectItem>
                <SelectItem value="Directa">Directa</SelectItem>
                <SelectItem value="Corporativo">Corporativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={vendedor} onValueChange={setVendedor}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="Juan López">Juan López</SelectItem>
                <SelectItem value="Pedro Soto">Pedro Soto</SelectItem>
                <SelectItem value="María Torres">María Torres</SelectItem>
              </SelectContent>
            </Select>
            {extraFilters}
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

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Chart */}
      {chart && (
        <div className="animate-fade-in-up" style={{ animationDelay: "280ms" }}>
          {chart}
        </div>
      )}

      {/* Data table */}
      <Card className="shadow-sm animate-fade-in-up" style={{ animationDelay: "350ms" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={cn(
                        "text-xs font-semibold cursor-pointer select-none hover:text-foreground transition-colors",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((row, i) => (
                  <TableRow
                    key={i}
                    className={cn(
                      drilldown && "cursor-pointer",
                      rowClassName?.(row) || "hover:bg-muted/50"
                    )}
                    onClick={() => handleRowClick(row)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          "text-sm",
                          col.align === "right" && "text-right tabular-nums",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Totals row */}
                {totalsRow && (
                  <TableRow className="bg-muted/60 hover:bg-muted/60 font-semibold">
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          "text-sm font-semibold",
                          col.align === "right" && "text-right tabular-nums",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {totalsRow[col.key] ?? ""}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drill-down Sheet */}
      {drilldown && selectedRow && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-lg">
                {drilldown.title(selectedRow)}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {drilldown.columns.map((col) => (
                      <TableHead
                        key={col.key}
                        className={cn(
                          "text-xs font-semibold",
                          col.align === "right" && "text-right"
                        )}
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drilldown.getData(selectedRow).map((row: any, i: number) => (
                    <TableRow key={i}>
                      {drilldown.columns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            "text-sm",
                            col.align === "right" && "text-right tabular-nums"
                          )}
                        >
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </TableCell>
                      ))}
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
