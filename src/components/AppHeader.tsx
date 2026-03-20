import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-primary px-6">
      <h1 className="text-sm font-semibold text-primary-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-primary-foreground/80 hover:text-primary-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1.5 -top-1.5 h-4 min-w-4 px-1 text-[10px] bg-accent text-accent-foreground border-0">
            3
          </Badge>
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
          JT
        </div>
      </div>
    </header>
  );
}
