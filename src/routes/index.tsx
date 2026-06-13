import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Flame,
  Footprints,
  Clock,
  Target as TargetIcon,
  TrendingUp,
  Calendar as CalIcon,
  CheckCircle2,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore, todayISO, useServices } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ActivityIcon } from "@/components/activity/ActivityIcon";
import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — FitFlow" }] }),
  component: Dashboard,
});

function greet() {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen";
  if (h < 20) return "Hallo";
  return "Guten Abend";
}

const motivationalQuotes = [
  "Jeder Tag zählt. Mach den nächsten besser.",
  "Konsequenz schlägt Perfektion.",
  "Du bist stärker als deine Ausreden.",
  "Kleine Schritte. Großer Fortschritt.",
];

function Dashboard() {
  const {
    activities,
    userName,
    habits,
    goals,
    toggleActivityComplete,
    userStepsToday,
    userStepsGoal,
    userCalorieToday,
    userCalorieGoal,
    userMinutesGoal,
  } = useStore();
  const services = useServices();
  const today = todayISO();
  const todayActivities = activities
    .filter((a) => a.date === today)
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  const upcoming = activities.filter((a) => a.date >= today).slice(0, 6);

  // Week stats
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const weekActs = activities.filter((a) => {
    const d = parseISO(a.date);
    return d >= weekStart && d <= weekEnd;
  });
  const weekDoneActs = weekActs.filter((a) => a.completed);
  const weekMinutes = weekDoneActs.reduce((s, a) => s + a.durationMin, 0);
  const activeDays = new Set(weekDoneActs.map((a) => a.date)).size;

  // Habit streaks today
  const habitsDoneToday = habits.filter((h) => h.log[today]).length;

  const quote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  // simple ring metrics
  const stepsToday = userStepsToday;
  const stepsGoal = userStepsGoal;
  const calorieToday = userCalorieToday;
  const calorieGoal = userCalorieGoal;
  const minutesToday = todayActivities
    .filter((a) => a.completed)
    .reduce((s, a) => s + a.durationMin, 0);
  const minutesGoal = userMinutesGoal;

  return (
    <div className="px-5 lg:px-10 py-6 lg:py-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title={`${greet()}, ${userName} 👋`} subtitle={quote} />
        <Link
          to="/settings"
          className="lg:hidden mt-2 p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Einstellungen"
        >
          <Settings className="h-6 w-6 text-muted-foreground hover:text-foreground" />
        </Link>
      </div>

      {/* Top ring stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <RingCard
          color="#4ade80"
          icon={<Footprints className="h-4 w-4" />}
          title="Schritte heute"
          value={`${stepsToday.toLocaleString("de-DE")} Steps`}
          sub={`${Math.round((stepsToday / stepsGoal) * 100)}% des Tagesziels`}
          ring={
            <ProgressRing value={stepsToday} max={stepsGoal} color="#4ade80" sublabel="Schritte" />
          }
        />
        <RingCard
          color="#60a5fa"
          icon={<Flame className="h-4 w-4" />}
          title="Kalorien"
          value={`${calorieToday} kcal`}
          sub={`Ziel ${calorieGoal} kcal`}
          ring={
            <ProgressRing value={calorieToday} max={calorieGoal} color="#60a5fa" sublabel="kcal" />
          }
        />
        <RingCard
          color="#a78bfa"
          icon={<Clock className="h-4 w-4" />}
          title="Trainingszeit"
          value={`${minutesToday} min`}
          sub={`Tagesziel ${minutesGoal} min`}
          ring={
            <ProgressRing value={minutesToday} max={minutesGoal} color="#a78bfa" sublabel="min" />
          }
        />
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill
          icon={<TargetIcon className="h-4 w-4" />}
          label="Einheiten / Woche"
          value={`${weekDoneActs.length}/${weekActs.length}`}
          accent="#4ade80"
        />
        <StatPill
          icon={<CalIcon className="h-4 w-4" />}
          label="Aktive Tage"
          value={`${activeDays}`}
          accent="#60a5fa"
        />
        <StatPill
          icon={<TrendingUp className="h-4 w-4" />}
          label="Wochenminuten"
          value={`${weekMinutes}`}
          accent="#a78bfa"
        />
        <StatPill
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Habits heute"
          value={`${habitsDoneToday}/${habits.length}`}
          accent="#f0abfc"
        />
      </div>

      {/* Today + upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Heute</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(), "EEEE, d. MMMM", { locale: de })}
              </p>
            </div>
            <Link
              to="/calendar"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Kalender <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {todayActivities.length === 0 ? (
            <EmptyState text="Heute steht nichts an. Zeit für eine spontane Session?" />
          ) : (
            <div className="space-y-2">
              {todayActivities.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  className={`group flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 p-3 transition-all hover:bg-accent/30`}
                >
                  <div
                    className="grid h-11 w-11 place-items-center rounded-xl shrink-0"
                    style={{ backgroundColor: `${a.color}22`, color: a.color }}
                  >
                    <ActivityIcon iconId={a.icon} color={a.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.startTime ?? "—"} • {a.durationMin} min
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActivityComplete(a.id)}
                    className={`grid h-9 w-9 place-items-center rounded-full transition-all ${a.completed ? "bg-primary text-primary-foreground shadow-glow" : "border border-border/60 text-muted-foreground hover:border-primary hover:text-primary"}`}
                    aria-label="Abschließen"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Ziele</h3>
            <Link
              to="/goals"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Alle <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {goals.slice(0, 4).map((g) => {
              const progress = services.goals.computeProgress(g, activities, {
                name: userName,
                stepsToday: userStepsToday,
              });
              const pct = Math.min(100, Math.round((progress / g.target) * 100));
              return (
                <div key={g.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-2">{g.title}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {progress}/{g.target}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming preview */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Kommende Sessions</h3>
          <Link
            to="/calendar"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Kalender <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-border/50 bg-background/40 p-3 transition-all hover:border-primary/40 hover:bg-accent/20"
            >
              <div
                className="grid h-9 w-9 place-items-center rounded-lg mb-2"
                style={{ backgroundColor: `${a.color}22`, color: a.color }}
              >
                <ActivityIcon iconId={a.icon} color={a.color} />
              </div>
              <div className="text-sm font-medium truncate">{a.title}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {isSameDay(parseISO(a.date), new Date())
                  ? "Heute"
                  : format(parseISO(a.date), "EEE d.MMM", { locale: de })}
                {a.startTime && ` • ${a.startTime}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RingCard({
  color,
  icon,
  title,
  value,
  sub,
  ring,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  ring: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 shadow-soft flex items-center gap-4">
      {ring}
      <div className="min-w-0">
        <div
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider"
          style={{ color }}
        >
          {icon}
          {title}
        </div>
        <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div
        className="flex items-center gap-2 text-xs uppercase tracking-wider"
        style={{ color: accent }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-background/30 p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
