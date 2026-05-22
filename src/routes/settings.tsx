import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLOR_OPTIONS, ICON_OPTIONS } from "@/lib/activities";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Einstellungen — FitFlow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { userName, setUserName, customActivities, addCustomActivity, deleteCustomActivity, resetAll } = useStore();
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [iconId, setIconId] = useState(ICON_OPTIONS[0].id);

  return (
    <div className="px-5 lg:px-10 py-6 lg:py-10 max-w-4xl mx-auto space-y-8">
      <PageHeader title="Einstellungen" subtitle="Personalisiere deine FitFlow-Erfahrung" />

      <section className="rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-4">Profil</h3>
        <div className="max-w-sm">
          <Label className="text-xs">Name</Label>
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} className="mt-1" />
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card/60 p-5 lg:p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-1">Eigene Aktivitäten</h3>
        <p className="text-sm text-muted-foreground mb-5">Erstelle eigene Sportarten mit Icon und Farbe</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-xs">Name</Label>
            <Input placeholder="z.B. Klettern" value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Farbe</Label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button key={c} onClick={() => setColor(c)} className="h-7 w-7 rounded-full transition" style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }} />
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs">Icon</Label>
            <div className="mt-1 grid grid-cols-8 gap-1.5">
              {ICON_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => setIconId(opt.id)} className={`h-8 w-8 grid place-items-center rounded-lg ${iconId === opt.id ? "bg-primary/20 ring-1 ring-primary" : "bg-accent/40"}`}>
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            if (!label.trim()) return toast.error("Name fehlt");
            addCustomActivity({ label: label.trim(), color, iconId });
            toast.success("Aktivität erstellt");
            setLabel("");
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-1" /> Aktivität hinzufügen
        </Button>

        {customActivities.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
            {customActivities.map((c) => {
              const opt = ICON_OPTIONS.find((i) => i.id === c.iconId);
              const Icon = opt?.icon;
              return (
                <motion.div key={c.id} layout className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: `${c.color}22`, color: c.color }}>
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 text-sm font-medium truncate">{c.label}</div>
                  <button onClick={() => deleteCustomActivity(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 lg:p-6">
        <h3 className="text-lg font-semibold text-destructive">Daten zurücksetzen</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">Setzt alle Aktivitäten, Ziele und Habits auf Demo-Daten zurück.</p>
        <Button variant="outline" onClick={() => { resetAll(); toast.success("Daten zurückgesetzt"); }} className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive">
          <RotateCcw className="h-4 w-4 mr-2" /> Zurücksetzen
        </Button>
      </section>
    </div>
  );
}
