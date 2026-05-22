import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Target, CheckCircle2, BarChart3, Settings, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/calendar", label: "Kalender", icon: Calendar },
  { to: "/goals", label: "Ziele", icon: Target },
  { to: "/habits", label: "Habits", icon: CheckCircle2 },
  { to: "/stats", label: "Statistiken", icon: BarChart3 },
  { to: "/settings", label: "Einstellungen", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col gap-2 border-r border-border/60 glass px-4 py-6">
      <Link to="/" className="mb-6 flex items-center gap-3 px-2">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
          <Flame className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-lg font-semibold tracking-tight">FitFlow</div>
          <div className="text-xs text-muted-foreground">Train. Track. Win.</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                active && "text-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("relative h-4.5 w-4.5 transition-colors", active && "text-primary")} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 to-secondary/10 p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-primary">Streak</div>
        <div className="mt-1 text-2xl font-bold">12 Tage</div>
        <div className="mt-0.5 text-xs text-muted-foreground">Bleib am Ball, du bist stark!</div>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navItems.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_currentColor]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
