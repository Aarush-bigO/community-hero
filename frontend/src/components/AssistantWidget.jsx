import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 11000,
            width: 'min(440px, calc(100vw - 32px))',
            height: 'min(640px, calc(100vh - 48px))',
          }}
          className="glass-strong rounded-2xl flex flex-col overflow-hidden border border-marigold-500/40 shadow-2xl shadow-black/95 bg-[#0D0F14]/98 backdrop-blur-2xl"
        >
          {/* Ambient top glowing line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-marigold-400 to-transparent animate-pulse" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#12151D]/90">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-marigold-500/20 border border-marigold-500/40 flex items-center justify-center text-marigold-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-silver-100 flex items-center gap-2">
                    <span>Civic AI Assistant</span>
                    <span className="text-[10px] font-mono bg-marigold-500/20 text-marigold-300 border border-marigold-500/40 px-1.5 py-0.2 rounded font-bold">
                      v2.4
                    </span>
                  </div>
                  <div className="text-[11px] text-silver-400 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-marigold-400 animate-pulse" /> Online • RAG Knowledge
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-silver-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-marigold-300 text-xs font-mono pl-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Querying city databases &amp; geospatial records…
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#12151D] border border-white/10 text-marigold-300 hover:border-marigold-500/50 hover:bg-marigold-500/10 transition select-none"
                  >
                    <span>⚡</span> {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask();
              }}
              className="p-3 border-t border-white/10 bg-[#12151D]/70 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about city reports, hotspots, SLAs…"
                className="input !py-2 text-xs font-mono flex-1 bg-[#08090C] border-white/10 text-silver-100 placeholder-silver-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FFC425] via-[#EAAA00] to-[#C79000] hover:from-[#FFD12E] hover:to-[#EAAA00] text-[#08090C] font-bold transition disabled:opacity-40"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
  );

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-[10500] w-14 h-14 rounded-full bg-gradient-to-tr from-[#FFC425] via-[#EAAA00] to-[#C79000] shadow-[0_0_30px_rgba(234,170,0,0.55),inset_0_1px_0_rgba(255,255,255,0.4)] grid place-items-center transition duration-200 ${
          open ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
        }`}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10500,
        }}
        title="Open Civic AI Assistant"
      >
        <Bot className="w-6 h-6 text-[#08090C]" />
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-marigold-400 ring-2 ring-[#08090C] flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </span>
      </motion.button>

      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}

function Bubble({ m }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-[#171B26] border border-marigold-500/30 rounded-2xl rounded-tr-md px-3.5 py-2 text-xs text-silver-100 font-sans shadow-md">
          {m.answer}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-lg bg-marigold-500/20 border border-marigold-500/40 flex items-center justify-center text-marigold-300 flex-shrink-0">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="max-w-[85%]">
        <div className="bg-[#12151D]/90 border border-white/10 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-xs whitespace-pre-wrap leading-relaxed text-silver-200 font-sans shadow-md">
          {renderMarkdown(m.answer)}
        </div>
        {m.citations?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {m.citations.map((c, i) => (
              <span key={i} className="chip !text-[10px] !px-2 !py-0.5 font-mono bg-[#12151D] border-white/10 text-marigold-300">
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
