import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { ACTIVITY_PRESETS } from "@/lib/activities";
import { addDays, format, parseISO, startOfWeek, subDays } from "date-fns";
import { de } from "date-fns/locale";
import { Flame, Clock, Activity, Trophy } from "lucide-react";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Statistiken — FitFlow" }] }),
  component: StatsPage,
});

function StatsPage() {
  const { activities, habits } = useStore();

  const weekData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(start, i);
      const key = format(d, "yyyy-MM-dd");
      const acts = activities.filter((a) => a.date === key && a.completed);
      return {
        day: format(d, "EE", { locale: de }),
        minutes: acts.reduce((s, a) => s + a.durationMin, 0),
        sessions: acts.length,
      };
    });
  }, [activities]);

  const monthData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const d = subDays(new Date(), 29 - i);
      const key = format(d, "yyyy-MM-dd");
      const acts = activities.filter((a) => a.date === key && a.completed);
      return {
        date: format(d, "d.M"),
        minutes: acts.reduce((s, a) => s + a.durationMin, 0),
      };
    });
  }, [activities]);

  const distribution = useMemo(() => {
    const map = new Map<string, number>();
    activities.filter((a) => a.completed).forEach((a) => {
      const key = a.presetId ?? a.customId ?? "other";
      map.set(key, (map.get(key) ?? 0) + a.durationMin);
    });
    return Array.from(map.entries()).map(([id, value]) => {
      const p = ACTIVITY_PRESETS.find((x) => x.id === id);
      return { name: p?.label ?? id, value, color: p?.color ?? "#94a3b8" };
    }).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [activities]);

  const totalMinutes = activities.filter((a) => a.completed).reduce((s, a) => s + a.durationMin, 0);
  const totalSessions = activities.filter((a) => a.completed).length;
  const habitTotalDays = habits.reduce((s, h) => s + Object.values(h.log).filter(Boolean).length, 0);
  const longestHabitStreak = useMemo(() => {
    let max = 0;
    for (const h of habits) {
      const dates = Object.entries(h.log).filter(([_, v]) => v).map(([k]) => k).sort();
      let cur = 0, best = 0, prev: string | null = null;
      for (const d of dates) {
        if (prev && format(addDays(parseISO(prev), 1), "yyyy-MM-dd") === d) cur++;
        else cur = 1;
        best = Math.max(best, cur);
        prev = d;
      }
      max = Math.max(max, best);
    }
    return max;
  }, [habits]);

  return (
    <div className="px-5 lg:px-10 py-6 lg:py-10 max-w-7xl mx-auto space-y-8">
      <PageHeader title="Statistiken" subtitle="Dein Fortschritt auf einen Blick" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BigStat icon={<Clock className="h-4 w-4" />} label="Min. gesamt" value={totalMinutes} accent="#4ade80" />
        <BigStat icon={<Activity className="h-4 w-4" />} label="Sessions" value={totalSessions} accent="#60a5fa" />
        <BigStat icon={<Flame className="h-4 w-4" />} label="Längster Habit-Streak" value={longestHabitStreak} accent="#fb923c" />
        <BigStat icon={<Trophy className="h-4 w-4" />} label="Habit-Tage" value={habitTotalDays} accent="#a78bfa" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Diese Woche" subtitle="Trainingsminuten pro Tag" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.012 250)" />
              <XAxis dataKey="day" stroke="oklch(0.6 0.015 250)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.6 0.015 250)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "oklch(0.2 0.013 250)", border: "1px solid oklch(0.3 0.014 250)", borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: "oklch(0.86 0.21 145 / 8%)" }}
              />
              <Bar dataKey="minutes" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Verteilung" subtitle="Trainingsminuten nach Sportart">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {distribution.map((d, i) => <Cell key={i} fill={d.color} stroke="oklch(0.2 0.013 250)" strokeWidth={2} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.2 0.013 250)", border: "1px solid oklch(0.3 0.014 250)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
            {distribution.slice(0, 6).map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="truncate text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Trend" subtitle="Letzte 30 Tage – Trainingsminuten">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.012 250)" />
            <XAxis dataKey="date" stroke="oklch(0.6 0.015 250)" fontSize={11} tickLine={false} axisLine={false} interval={3} />
            <YAxis stroke="oklch(0.6 0.015 250)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "oklch(0.2 0.013 250)", border: "1px solid oklch(0.3 0.014 250)", borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="minutes" stroke="#4ade80" strokeWidth={2.5} fill="url(#areaGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function BigStat({ icon, label, value, accent }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider" style={{ color: accent }}>
        {icon}{label}
      </div>
      <div className="mt-1 text-3xl font-bold tabular-nums">{value}</div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children, className = "" }: any) {
  return (
    <div className={`rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
