import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Pedidos from "@/pages/Pedidos";
import ReporteVentasCanal from "@/pages/ReporteVentasCanal";
import ReporteVentasVendedor from "@/pages/ReporteVentasVendedor";
import ReporteGastosCanal from "@/pages/ReporteGastosCanal";
import ReporteCxC from "@/pages/ReporteCxC";
import ReporteVentasProducto from "@/pages/ReporteVentasProducto";
import ReporteVentasLinea from "@/pages/ReporteVentasLinea";
import ReporteDevoluciones from "@/pages/ReporteDevoluciones";
import Gastos from "@/pages/Gastos";
import VencidosPool from "@/pages/VencidosPool";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/reportes/dashboard" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/reportes/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/reportes/ventas" element={<ReporteVentasCanal />} />
            <Route path="/reportes/ventas-vendedor" element={<ReporteVentasVendedor />} />
            <Route path="/reportes/gastos" element={<ReporteGastosCanal />} />
            <Route path="/reportes/cxc" element={<ReporteCxC />} />
            <Route path="/reportes/ventas-producto" element={<ReporteVentasProducto />} />
            <Route path="/reportes/ventas-linea" element={<ReporteVentasLinea />} />
            <Route path="/reportes/devoluciones" element={<ReporteDevoluciones />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/vencidos/pool" element={<VencidosPool />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
