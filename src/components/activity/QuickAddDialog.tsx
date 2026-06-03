import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ACTIVITY_PRESETS, COLOR_OPTIONS, ICON_OPTIONS } from "@/lib/activities";
import { useStore, todayISO } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function QuickAddDialog({
  onClose,
  defaultDate,
}: {
  onClose: () => void;
  defaultDate?: string;
}) {
  const { addActivity, addCustomActivity, customActivities } = useStore();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedCustom, setSelectedCustom] = useState<string | null>(null);
  const [date, setDate] = useState(defaultDate ?? todayISO());
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(45);
  const [distance, setDistance] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityIcon, setNewActivityIcon] = useState("activity");
  const [newActivityColor, setNewActivityColor] = useState(COLOR_OPTIONS[0]);
  const [createdActivityName, setCreatedActivityName] = useState<string | null>(null);

  // Beobachte customActivities und wähle die neu erstellte Aktivität aus
  useEffect(() => {
    if (createdActivityName) {
      const created = customActivities.find(
        (c) => c.label === createdActivityName && c.color === newActivityColor,
      );
      if (created) {
        setSelectedCustom(created.id);
        setCreatedActivityName(null);
      }
    }
  }, [customActivities, createdActivityName, newActivityColor]);

  const selectedPresetData = selectedPreset
    ? ACTIVITY_PRESETS.find((p) => p.id === selectedPreset)
    : null;
  const showDistance = selectedPresetData?.trackDistance;
  const showSteps = selectedPresetData?.trackSteps;

  const handleCreateNewActivity = () => {
    if (!newActivityName.trim()) {
      toast.error("Bitte einen Namen eingeben");
      return;
    }
    const trimmedName = newActivityName.trim();
    addCustomActivity({
      label: trimmedName,
      color: newActivityColor,
      iconId: newActivityIcon,
    });
    setCreatedActivityName(trimmedName);
    setIsCreatingNew(false);
    setNewActivityName("");
    toast.success(`${trimmedName} erstellt ✨`);
  };

  const handleSubmit = () => {
    if (selectedPreset) {
      const preset = ACTIVITY_PRESETS.find((p) => p.id === selectedPreset)!;
      addActivity({
        presetId: preset.id,
        title: preset.label,
        color: preset.color,
        icon: preset.id,
        date,
        startTime: time,
        durationMin: duration,
        distance: distance ?? undefined,
        steps: steps ?? undefined,
      });
      toast.success(`${preset.label} hinzugefügt`, {
        description: `${date} • ${time} • ${duration} min`,
      });
      onClose();
      return;
    }
    if (selectedCustom) {
      const c = customActivities.find((c) => c.id === selectedCustom)!;
      addActivity({
        customId: c.id,
        title: c.label,
        color: c.color,
        icon: c.iconId,
        date,
        startTime: time,
        durationMin: duration,
      });
      toast.success(`${c.label} hinzugefügt`, {
        description: `${date} • ${time} • ${duration} min`,
      });
      onClose();
      return;
    }
    toast.error("Bitte eine Aktivität wählen");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-sm p-0 lg:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full lg:max-w-2xl glass-strong rounded-t-3xl lg:rounded-3xl border border-border/60 p-6 shadow-elevated max-h-[90vh] overflow-y-auto scrollbar-thin"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Aktivität hinzufügen</h3>
            <p className="text-sm text-muted-foreground">Wähle eine Sportart und plane sie ein</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sportart</Label>
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {ACTIVITY_PRESETS.map((p) => {
              const Icon = p.icon;
              const active = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPreset(p.id);
                    setSelectedCustom(null);
                    setDuration(p.defaultDurationMin);
                    setDistance(null);
                    setSteps(null);
                    setIsCreatingNew(false);
                  }}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                    active
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/60 hover:border-border hover:bg-accent/30"
                  }`}
                >
                  <div
                    className="grid h-9 w-9 place-items-center rounded-lg"
                    style={{ backgroundColor: `${p.color}22`, color: p.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[11px] font-medium leading-tight">{p.label}</span>
                </button>
              );
            })}
          </div>

          {customActivities.length > 0 && (
            <>
              <Label className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">
                Eigene
              </Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {customActivities.map((c) => {
                  const active = selectedCustom === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustom(c.id);
                        setSelectedPreset(null);
                        setIsCreatingNew(false);
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        active
                          ? "ring-2 ring-offset-2 ring-offset-background"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: `${c.color}22`,
                        color: c.color,
                        boxShadow: active ? `0 0 0 2px ${c.color}` : undefined,
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {!isCreatingNew && (
            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setIsCreatingNew(true)}
            >
              + Neue Aktivität
            </Button>
          )}

          {isCreatingNew && (
            <div className="mt-5 rounded-xl border border-border/60 bg-accent/20 p-4 space-y-4">
              <div>
                <Label htmlFor="new-name" className="text-xs">
                  Name der Aktivität
                </Label>
                <Input
                  id="new-name"
                  placeholder="z.B. Boxen, Klettern..."
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs mb-2 block">Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = newActivityIcon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setNewActivityIcon(opt.id)}
                        className={`flex items-center justify-center p-2 rounded-lg border transition-all ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs mb-2 block">Farbe</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewActivityColor(c)}
                      className="h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition"
                      style={{
                        backgroundColor: c,
                        boxShadow: newActivityColor === c ? `0 0 0 2px ${c}` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewActivityName("");
                  }}
                >
                  Abbrechen
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCreateNewActivity}
                >
                  Erstellen
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="date" className="text-xs">
              Datum
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-xs">
              Uhrzeit
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dur" className="text-xs">
              Dauer (min)
            </Label>
            <Input
              id="dur"
              type="number"
              value={duration}
              min={5}
              step={5}
              onChange={(e) => setDuration(parseInt(e.target.value || "0"))}
              className="mt-1"
            />
          </div>
        </div>

        {showDistance && (
          <div className="mt-3">
            <Label htmlFor="dist" className="text-xs">
              Strecke (km)
            </Label>
            <Input
              id="dist"
              type="number"
              placeholder="0.0"
              value={distance ?? ""}
              onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : null)}
              step={0.1}
              className="mt-1"
            />
          </div>
        )}

        {showSteps && (
          <div className="mt-3">
            <Label htmlFor="steps" className="text-xs">
              Schritte
            </Label>
            <Input
              id="steps"
              type="number"
              placeholder="0"
              value={steps ?? ""}
              onChange={(e) => setSteps(e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
          >
            Hinzufügen
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
