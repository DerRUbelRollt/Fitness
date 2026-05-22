import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addMonths, addWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format,
  isSameMonth, isSameDay, parseISO, addDays, subDays,
} from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useStore, todayISO } from "@/lib/store";
import { ActivityIcon } from "@/components/activity/ActivityIcon";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuickAddDialog } from "@/components/activity/QuickAddDialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Kalender — FitFlow" }] }),
  component: CalendarPage,
});

type View = "month" | "week" | "day";

function CalendarPage() {
  const { activities, deleteActivity, toggleActivityComplete, moveActivity } = useStore();
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayISO());
  const [addDate, setAddDate] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const nav = (dir: 1 | -1) => {
    if (view === "month") setCursor(addMonths(cursor, dir));
    else if (view === "week") setCursor(addWeeks(cursor, dir));
    else setCursor(dir > 0 ? addDays(cursor, 1) : subDays(cursor, 1));
  };

  const headerLabel =
    view === "month" ? format(cursor, "MMMM yyyy", { locale: de })
    : view === "week" ? `KW ${format(cursor, "I")} • ${format(startOfWeek(cursor, { weekStartsOn: 1 }), "d.M.")} – ${format(endOfWeek(cursor, { weekStartsOn: 1 }), "d.M.yyyy")}`
    : format(cursor, "EEEE, d. MMMM yyyy", { locale: de });

  const activitiesByDate = activities.reduce<Record<string, typeof activities>>((acc, a) => {
    (acc[a.date] = acc[a.date] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="px-5 lg:px-10 py-6 lg:py-10 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Kalender"
        subtitle="Plane und tracke deine Sessions"
        actions={
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${view === v ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {view === v && (
                  <motion.div layoutId="cal-view" className="absolute inset-0 rounded-full bg-primary shadow-glow" />
                )}
                <span className="relative capitalize">{v === "month" ? "Monat" : v === "week" ? "Woche" : "Tag"}</span>
              </button>
            ))}
          </div>
        }
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => nav(-1)} className="rounded-full"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => nav(1)} className="rounded-full"><ChevronRight className="h-4 w-4" /></Button>
          <div className="ml-2 text-lg font-semibold tracking-tight capitalize">{headerLabel}</div>
        </div>
        <Button onClick={() => setCursor(new Date())} variant="ghost" size="sm">Heute</Button>
      </div>

      {view === "month" && (
        <MonthGrid
          cursor={cursor}
          activitiesByDate={activitiesByDate}
          onSelect={(d) => { setSelectedDate(d); }}
          onAddOnDay={(d) => setAddDate(d)}
          dragId={dragId}
          setDragId={setDragId}
          onDropOnDay={(d) => { if (dragId) { moveActivity(dragId, d); setDragId(null); } }}
          selectedDate={selectedDate}
        />
      )}

      {view === "week" && (
        <WeekStrip cursor={cursor} activitiesByDate={activitiesByDate} onSelect={setSelectedDate} selectedDate={selectedDate} onAddOnDay={(d) => setAddDate(d)} />
      )}

      {view === "day" && (
        <DayList date={format(cursor, "yyyy-MM-dd")} activitiesByDate={activitiesByDate} onAdd={(d) => setAddDate(d)} onToggle={toggleActivityComplete} onDelete={deleteActivity} />
      )}

      {/* Day detail panel for month/week */}
      {view !== "day" && selectedDate && (
        <div className="rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Ausgewählt</div>
              <div className="text-lg font-semibold">{format(parseISO(selectedDate), "EEEE, d. MMMM", { locale: de })}</div>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setAddDate(selectedDate)}>
              <Plus className="h-4 w-4 mr-1" /> Aktivität
            </Button>
          </div>
          <DayList date={selectedDate} activitiesByDate={activitiesByDate} onAdd={(d) => setAddDate(d)} onToggle={toggleActivityComplete} onDelete={deleteActivity} embedded />
        </div>
      )}

      <AnimatePresence>
        {addDate && <QuickAddDialog defaultDate={addDate} onClose={() => setAddDate(null)} />}
      </AnimatePresence>
    </div>
  );
}

function MonthGrid({ cursor, activitiesByDate, onSelect, onAddOnDay, dragId, setDragId, onDropOnDay, selectedDate }: any) {
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const today = new Date();

  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-3 lg:p-5 shadow-soft">
      <div className="grid grid-cols-7 gap-1 mb-2 px-1">
        {weekdays.map((d) => (
          <div key={d} className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground text-center py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const acts = activitiesByDate[key] ?? [];
          const inMonth = isSameMonth(d, cursor);
          const isToday = isSameDay(d, today);
          const isSelected = selectedDate === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              onDoubleClick={() => onAddOnDay(key)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropOnDay(key)}
              className={`relative aspect-square sm:aspect-auto sm:min-h-[92px] flex flex-col items-stretch text-left rounded-xl p-1.5 transition-all ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : "ring-1 ring-border/40 hover:ring-border"
              } ${inMonth ? "bg-background/30" : "bg-background/10 text-muted-foreground/50"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isToday ? "grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground" : ""}`}>
                  {format(d, "d")}
                </span>
                {acts.length > 0 && <span className="text-[10px] text-muted-foreground">{acts.length}</span>}
              </div>
              <div className="mt-1 flex-1 space-y-0.5 overflow-hidden">
                {acts.slice(0, 3).map((a: any) => (
                  <div
                    key={a.id}
                    draggable
                    onDragStart={() => setDragId(a.id)}
                    onDragEnd={() => setDragId(null)}
                    className={`group flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium truncate cursor-grab ${a.completed ? "opacity-60 line-through" : ""}`}
                    style={{ backgroundColor: `${a.color}22`, color: a.color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <span className="truncate">{a.title}</span>
                  </div>
                ))}
                {acts.length > 3 && <div className="text-[10px] text-muted-foreground">+ {acts.length - 3}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekStrip({ cursor, activitiesByDate, onSelect, selectedDate, onAddOnDay }: any) {
  const start = startOfWeek(cursor, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end: addDays(start, 6) });
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const key = format(d, "yyyy-MM-dd");
        const acts = activitiesByDate[key] ?? [];
        const isToday = isSameDay(d, new Date());
        const isSelected = selectedDate === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            onDoubleClick={() => onAddOnDay(key)}
            className={`rounded-2xl border p-3 text-left transition-all min-h-[160px] ${
              isSelected ? "border-primary bg-primary/5 shadow-glow" : "border-border/60 bg-card/60 hover:border-border"
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{format(d, "EEE", { locale: de })}</div>
            <div className={`text-xl font-bold ${isToday ? "text-primary" : ""}`}>{format(d, "d")}</div>
            <div className="mt-2 space-y-1">
              {acts.slice(0, 4).map((a: any) => (
                <div key={a.id} className="flex items-center gap-1.5 text-[11px] truncate rounded-md px-1.5 py-0.5" style={{ backgroundColor: `${a.color}1f`, color: a.color }}>
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                  {a.title}
                </div>
              ))}
              {acts.length > 4 && <div className="text-[10px] text-muted-foreground">+ {acts.length - 4}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DayList({ date, activitiesByDate, onAdd, onToggle, onDelete, embedded }: any) {
  const acts = (activitiesByDate[date] ?? []).slice().sort((a: any, b: any) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  return (
    <div className={embedded ? "" : "rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft"}>
      {!embedded && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{format(parseISO(date), "EEEE, d. MMMM", { locale: de })}</h3>
          <Button size="sm" onClick={() => onAdd(date)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" /> Aktivität
          </Button>
        </div>
      )}
      {acts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Keine Aktivitäten an diesem Tag. <button onClick={() => onAdd(date)} className="text-primary hover:underline">Jetzt eine hinzufügen</button>.
        </div>
      ) : (
        <div className="space-y-2">
          {acts.map((a: any) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 p-3"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl shrink-0" style={{ backgroundColor: `${a.color}22`, color: a.color }}>
                <ActivityIcon iconId={a.icon} color={a.color} />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`font-medium truncate ${a.completed ? "line-through text-muted-foreground" : ""}`}>{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.startTime ?? "—"} • {a.durationMin} min</div>
              </div>
              <button
                onClick={() => onToggle(a.id)}
                className={`grid h-9 w-9 place-items-center rounded-full transition-all ${a.completed ? "bg-primary text-primary-foreground shadow-glow" : "border border-border/60 text-muted-foreground hover:border-primary hover:text-primary"}`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(a.id)} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
