import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Wallet,
  AlertTriangle,
  UserCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

const sections: NavSection[] = [
  {
    label: "INICIO",
    items: [{ title: "Dashboard", url: "/reportes/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "PEDIDOS",
    items: [{ title: "Lista de Pedidos", url: "/pedidos", icon: ShoppingCart }],
  },
  {
    label: "REPORTES",
    collapsible: true,
    items: [
      { title: "Ventas x Canal", url: "/reportes/ventas" },
      { title: "Ventas x Vendedor", url: "/reportes/ventas-vendedor" },
      { title: "Gastos x Canal", url: "/reportes/gastos" },
      { title: "Cuentas x Cobrar", url: "/reportes/cxc" },
      { title: "Ventas x Producto", url: "/reportes/ventas-producto" },
      { title: "Ventas x Línea", url: "/reportes/ventas-linea" },
      { title: "Devoluciones", url: "/reportes/devoluciones" },
    ],
  },
  {
    label: "GASTOS",
    items: [{ title: "Gastos", url: "/gastos", icon: Wallet }],
  },
  {
    label: "VENCIDOS",
    items: [
      { title: "Pool de Decisión", url: "/vencidos/pool", icon: AlertTriangle },
      { title: "Alertas", url: "/vencidos/alertas", icon: AlertTriangle },
    ],
  },
  {
    label: "CUENTA",
    items: [{ title: "Mi Cuenta", url: "/cuenta", icon: UserCircle }],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [reportesOpen, setReportesOpen] = useState(
    location.pathname.startsWith("/reportes/") && location.pathname !== "/reportes/dashboard"
  );

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-primary">
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
          <span className="text-sm font-bold text-accent-foreground">PT</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary-foreground">Torres SGV</span>
          <span className="text-[10px] text-sidebar-muted">Gerente General</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {sections.map((section) => {
          const isReportes = section.collapsible;
          const sectionActive = section.items.some((item) => location.pathname === item.url || location.pathname.startsWith(item.url + "/"));

          return (
            <div key={section.label}>
              {isReportes ? (
                <button
                  onClick={() => setReportesOpen(!reportesOpen)}
                  className="flex w-full items-center justify-between mb-2 px-3 group"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-sidebar-muted" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted group-hover:text-primary-foreground/70 transition-colors">
                      {section.label}
                    </span>
                  </div>
                  {reportesOpen ? (
                    <ChevronDown className="h-3 w-3 text-sidebar-muted" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-sidebar-muted" />
                  )}
                </button>
              ) : (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
                  {section.label}
                </p>
              )}

              {(!isReportes || reportesOpen) && (
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = location.pathname === item.url;
                    const Icon = item.icon;
                    return (
                      <li key={item.url}>
                        <Link
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isReportes && "pl-8 text-xs",
                            active
                              ? "bg-primary-light text-primary"
                              : "text-primary-foreground/80 hover:bg-sidebar-accent hover:text-primary-foreground"
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-[10px] text-sidebar-muted">© 2026 Panificadora Torres</p>
      </div>
    </aside>
  );
}
