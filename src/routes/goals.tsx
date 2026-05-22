import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACTIVITY_PRESETS } from "@/lib/activities";
import { computeGoalProgress } from "./index";
import { toast } from "sonner";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Ziele — FitFlow" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const { goals, addGoal, deleteGoal, activities } = useStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(3);
  const [unit, setUnit] = useState("Einheiten");
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [activityFilter, setActivityFilter] = useState<string>("");

  const submit = () => {
    if (!title.trim()) return toast.error("Titel fehlt");
    addGoal({ title: title.trim(), target, unit, period, activityFilter: activityFilter || undefined });
    toast.success("Ziel hinzugefügt 🎯");
    setOpen(false); setTitle(""); setTarget(3);
  };

  return (
    <div className="px-5 lg:px-10 py-6 lg:py-10 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Deine Ziele"
        subtitle="Setze klare Ziele und sieh deinen Fortschritt"
        actions={<Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"><Plus className="h-4 w-4 mr-1" /> Neues Ziel</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => {
          const progress = computeGoalProgress(g, activities);
          const pct = Math.min(100, Math.round((progress / g.target) * 100));
          const done = pct >= 100;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative rounded-3xl border p-5 transition-all ${done ? "border-primary/60 bg-primary/5 shadow-glow" : "border-border/60 bg-card/60"}`}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-tight">{g.title}</h3>
              <div className="mt-1 text-xs text-muted-foreground capitalize">
                {g.period === "day" ? "Täglich" : g.period === "week" ? "Wöchentlich" : "Monatlich"}
              </div>
              <div className="mt-4">
                <div className="flex items-end justify-between mb-1.5">
                  <div className="text-2xl font-bold tabular-nums">{progress}<span className="text-sm font-medium text-muted-foreground">/{g.target} {g.unit}</span></div>
                  <div className={`text-xs font-semibold ${done ? "text-primary" : "text-muted-foreground"}`}>{pct}%</div>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary"
                  />
                </div>
                {done && <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">🏆 Ziel erreicht!</div>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-strong rounded-3xl border border-border/60 p-6 shadow-elevated"
          >
            <h3 className="text-xl font-semibold mb-5">Neues Ziel</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Titel</Label>
                <Input placeholder="z.B. 4× Gym pro Woche" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Zielwert</Label>
                  <Input type="number" value={target} min={1} onChange={(e) => setTarget(parseInt(e.target.value || "1"))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Einheit</Label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option>Einheiten</option><option>Minuten</option><option>Schritte</option><option>Liter</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Zeitraum</Label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(["day", "week", "month"] as const).map((p) => (
                    <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg border px-3 py-2 text-sm font-medium ${period === p ? "border-primary bg-primary/10 text-primary" : "border-border/60"}`}>
                      {p === "day" ? "Tag" : p === "week" ? "Woche" : "Monat"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs">Aktivität (optional)</Label>
                <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Alle</option>
                  {ACTIVITY_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
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
