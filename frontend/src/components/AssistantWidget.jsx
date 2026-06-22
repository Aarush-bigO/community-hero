import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { api } from '../utils/api';

const SUGGESTIONS = [
  'How many issues are open?',
  "What's the sentiment trend?",
  'Show top hotspots',
  'Which department is fastest?',
  'Are there any SLA breaches?',
];

const HELLO = {
  role: 'assistant',
  answer:
    "Hi 👋 I'm your **Civic AI Assistant** — ask me anything about reports, sentiment, departments, hotspots, or SLAs. I cite my sources.",
  citations: [],
};

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([HELLO]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' });
  }, [messages, loading]);

  const ask = async (question) => {
    const q = (question || input).trim();
    if (!q) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', answer: q }]);
    setLoading(true);
    try {
      const r = await api.agent.ask(q);
      setMessages((m) => [...m, { role: 'assistant', ...r }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', answer: `Error: ${e.message}`, citations: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 shadow-2xl shadow-accent-500/40 grid place-items-center transition ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Bot className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#070b18] animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[60] w-[min(420px,calc(100vw-2rem))] h-[min(640px,calc(100vh-3rem))] glass-strong rounded-3xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-brand-500/15 to-accent-500/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 grid place-items-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm">Civic AI Assistant</div>
                  <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-sm pl-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="chip text-[11px] hover:bg-brand-500/20 hover:border-brand-400/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask();
              }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your city's data..."
                className="input !py-2 text-sm"
              />
              <button type="submit" disabled={loading} className="btn-primary !px-3 !py-2">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ m }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-brand-500/25 border border-brand-400/30 rounded-2xl rounded-tr-md px-3.5 py-2 text-sm">
          {m.answer}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-accent-500 grid place-items-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-md px-3.5 py-2 text-sm whitespace-pre-wrap leading-relaxed">
          {renderMarkdown(m.answer)}
        </div>
        {m.citations?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {m.citations.map((c, i) => (
              <span key={i} className="chip !text-[10px] !px-2 !py-0.5 bg-emerald-500/10 border-emerald-500/30">
                <ExternalLink className="w-2.5 h-2.5" /> {c.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mini-markdown: bold + line breaks (no full parser to keep bundle slim)
function renderMarkdown(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} className="text-white">{p.slice(2, -2)}</strong>;
    return <span key={i}>{p}</span>;
  });
}
