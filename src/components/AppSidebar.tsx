import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Wallet,
  AlertTriangle,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "INICIO",
    items: [
      { title: "Dashboard", url: "/reportes/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "PEDIDOS",
    items: [
      { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
    ],
  },
  {
    label: "REPORTES",
    items: [
      { title: "Reportes", url: "/reportes", icon: BarChart3 },
    ],
  },
  {
    label: "GASTOS",
    items: [
      { title: "Gastos", url: "/gastos", icon: Wallet },
    ],
  },
  {
    label: "VENCIDOS",
    items: [
      { title: "Vencidos", url: "/vencidos", icon: AlertTriangle },
    ],
  },
  {
    label: "CUENTA",
    items: [
      { title: "Mi Cuenta", url: "/cuenta", icon: UserCircle },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname.startsWith(item.url);
                return (
                  <li key={item.url}>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-light text-primary"
                          : "text-primary-foreground/80 hover:bg-sidebar-accent hover:text-primary-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-[10px] text-sidebar-muted">© 2026 Panificadora Torres</p>
      </div>
    </aside>
  );
}
