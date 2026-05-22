import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuickAddDialog } from "@/components/activity/QuickAddDialog";

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 lg:bottom-8 right-5 lg:right-8 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow animate-pulse-glow"
        aria-label="Aktivität hinzufügen"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
      <AnimatePresence>
        {open && <QuickAddDialog onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
