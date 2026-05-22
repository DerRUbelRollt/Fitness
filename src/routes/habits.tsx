import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Flame, Trash2 } from "lucide-react";
import { useStore, todayISO } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLOR_OPTIONS } from "@/lib/activities";
import { toast } from "sonner";
import { addDays, format, parseISO, subDays } from "date-fns";
import { de } from "date-fns/locale";

export const Route = createFileRoute("/habits")({
  head: () => ({ meta: [{ title: "Habits — FitFlow" }] }),
  component: HabitsPage,
});

function HabitsPage() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💪");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const submit = () => {
    if (!name.trim()) return toast.error("Name fehlt");
    addHabit({ name: name.trim(), emoji, color });
    toast.success("Habit hinzugefügt ✨");
    setOpen(false); setName("");
  };

  return (
    <div className="px-5 lg:px-10 py-6 lg:py-10 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Habit Tracker"
        subtitle="Tägliche Gewohnheiten, große Wirkung"
        actions={<Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"><Plus className="h-4 w-4 mr-1" /> Neuer Habit</Button>}
      />

      <div className="space-y-5">
        {habits.map((h) => <HabitRow key={h.id} habit={h} onToggle={toggleHabit} onDelete={deleteHabit} />)}
      </div>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass-strong rounded-3xl border border-border/60 p-6 shadow-elevated">
            <h3 className="text-xl font-semibold mb-5">Neuer Habit</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Name</Label>
                <Input placeholder="z.B. 2L Wasser" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Emoji</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {["💧","💪","🧘","🏃","🚴","🌙","🥗","📚","🚫","☀️","🧠","❤️"].map((e) => (
                    <button key={e} onClick={() => setEmoji(e)} className={`h-10 w-10 rounded-lg text-xl ${emoji === e ? "bg-primary/20 ring-2 ring-primary" : "bg-accent/40"}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs">Farbe</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button key={c} onClick={() => setColor(c)} className="h-8 w-8 rounded-full ring-offset-2 ring-offset-background transition" style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Abbrechen</Button>
              <Button onClick={submit} className="bg-primary text-primary-foreground hover:bg-primary/90">Speichern</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function HabitRow({ habit, onToggle, onDelete }: any) {
  const today = todayISO();
  // streak calc
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    if (habit.log[d]) streak++;
    else if (i > 0) break;
  }

  // heatmap: last 91 days
  const days: { date: string; done: boolean }[] = [];
  for (let i = 90; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    days.push({ date: d, done: !!habit.log[d] });
  }
  const last30 = days.slice(-30);
  const doneCount30 = last30.filter((x) => x.done).length;
  const pct = Math.round((doneCount30 / 30) * 100);

  const last7 = Array.from({ length: 7 }).map((_, i) => format(addDays(subDays(new Date(), 6), i), "yyyy-MM-dd"));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ backgroundColor: `${habit.color}22` }}>
            {habit.emoji}
          </div>
          <div>
            <div className="text-lg font-semibold">{habit.name}</div>
            <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs">
              <Flame className="h-3.5 w-3.5" style={{ color: habit.color }} />
              <span className="font-semibold" style={{ color: habit.color }}>{streak} Tage</span>
              <span className="text-muted-foreground">Streak • {pct}% in 30 Tagen</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {last7.map((d) => {
            const done = !!habit.log[d];
            const isToday = d === today;
            return (
              <button
                key={d}
                onClick={() => onToggle(habit.id, d)}
                className={`h-9 w-9 rounded-lg text-[10px] font-medium grid place-items-center transition-all ${isToday ? "ring-1 ring-primary/60" : ""}`}
                style={{ backgroundColor: done ? habit.color : "oklch(0.26 0.012 250)", color: done ? "#000" : "var(--color-muted-foreground)" }}
              >
                {format(parseISO(d), "EE", { locale: de }).slice(0, 1)}
              </button>
            );
          })}
          <button onClick={() => onDelete(habit.id)} className="ml-2 grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* heatmap */}
      <div className="mt-5 grid grid-rows-7 grid-flow-col gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {days.map((d) => (
          <div
            key={d.date}
            title={`${d.date}${d.done ? " ✓" : ""}`}
            className="h-3 w-3 rounded-[3px] transition-all"
            style={{ backgroundColor: d.done ? habit.color : "oklch(0.24 0.012 250)" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
