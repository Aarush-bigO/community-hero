import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Toast() {
  const toast = useStore((s) => s.toast);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] glass-strong rounded-2xl px-5 py-3 flex items-center gap-3 max-w-md"
        >
          <span className="text-2xl">{toast.icon || '✨'}</span>
          <div>
            <div className="font-semibold">{toast.title}</div>
            {toast.message && <div className="text-sm text-slate-300">{toast.message}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
