/**
 * AI Civic Assistant — an LLM-style agent answering natural-language questions
 * about the dataset. Pure deterministic for the mock provider; pluggable to
 * OpenAI/Groq/Ollama via the same SYSTEM contract (kept short for the demo).
 *
 * The agent answers questions like:
 *   "How many potholes are open this week?"
 *   "What's the sentiment trend?"
 *   "Which department is fastest?"
 *   "Show top 3 hotspots."
 *
 * It always returns { answer, citations[], data? } so the UI can render
 * with source-of-truth chips (the Zencity-style citation requirement).
 */
import { getDb } from '../db/init.js';
import { aggregateSentiment } from './sentiment.js';

const INTENTS = [
  { id: 'count_open', re: /how many.*(open|reported|pending|unresolved)/i },
  { id: 'count_resolved', re: /how many.*(resolved|fixed|closed)/i },
  { id: 'category_breakdown', re: /(which|what).*(category|categories|type)/i },
  { id: 'sentiment_trend', re: /sentiment|mood|feeling|frustration/i },
  { id: 'fastest_dept', re: /(fast|quick|slow|slowest|response).*(dept|department|team)/i },
  { id: 'top_hotspots', re: /(hotspot|hot zones|concentration|cluster)/i },
  { id: 'top_reporters', re: /(top|best|most active).*(report|user|hero|citizen)/i },
  { id: 'sla_breach', re: /(sla|overdue|breach|late|missed)/i },
  { id: 'help', re: /(help|what can you|capabilities)/i },
];

function findIntent(q) {
  return INTENTS.find((i) => i.re.test(q))?.id || 'fallback';
}

export async function ask(question) {
  const db = getDb();
  const intent = findIntent(question);

  switch (intent) {
    case 'count_open': {
      const rows = db
        .prepare(
          "SELECT COUNT(*) c FROM issues WHERE status NOT IN ('resolved','rejected')"
        )
        .all();
      const c = rows[0]?.c || 0;
      return citeResult(`There are **${c} open issues** right now across all categories.`, [
        { label: 'issues table', endpoint: '/api/issues?status=reported' },
      ]);
    }

    case 'count_resolved': {
      const c = db.prepare("SELECT COUNT(*) c FROM issues WHERE status = 'resolved'").all()[0].c;
      const total = db.prepare('SELECT COUNT(*) c FROM issues').all()[0].c;
      const pct = total ? Math.round((c / total) * 100) : 0;
      return citeResult(
        `**${c} issues resolved** out of ${total} total — that's a **${pct}% resolution rate**.`,
        [{ label: 'stats', endpoint: '/api/stats' }]
      );
    }

    case 'category_breakdown': {
      const rows = db
        .prepare('SELECT category, COUNT(*) c FROM issues GROUP BY category ORDER BY c DESC')
        .all();
      const top = rows[0];
      const lines = rows.map((r) => `- ${r.category}: **${r.c}**`).join('\n');
      return citeResult(
        `**${top?.category || 'no data'}** is the top category. Full breakdown:\n${lines}`,
        [{ label: 'stats', endpoint: '/api/stats' }],
        { categories: rows }
      );
    }

    case 'sentiment_trend': {
      const issues = db.prepare('SELECT sentiment, sentiment_label FROM issues').all();
      const pulse = db.prepare('SELECT sentiment, sentiment_label FROM pulse_signals').all();
      const issueSent = aggregateSentiment(issues);
      const pulseSent = aggregateSentiment(pulse);
      return citeResult(
        `**Issue sentiment** is *${issueSent.label}* (avg ${issueSent.avg}).\n` +
          `**Public discourse sentiment** (city pulse) is *${pulseSent.label}* (avg ${pulseSent.avg}).\n` +
          `Negative reports: ${issueSent.counts.negative} · Pulse mentions today: ${pulse.length}.`,
        [
          { label: 'issues', endpoint: '/api/issues' },
          { label: 'pulse', endpoint: '/api/pulse' },
        ],
        { issueSent, pulseSent }
      );
    }

    case 'fastest_dept': {
      const rows = db
        .prepare(
          `SELECT d.name, COUNT(i.id) AS resolved,
            AVG(julianday(i.updated_at) - julianday(i.created_at)) * 24 AS avg_hours
          FROM issues i JOIN departments d ON d.id = i.department_id
          WHERE i.status = 'resolved' GROUP BY d.id ORDER BY avg_hours ASC LIMIT 5`
        )
        .all();
      if (!rows.length) return citeResult('No resolved issues yet — ask again after some get fixed.');
      const lines = rows
        .map((r) => `- ${r.name}: **${(r.avg_hours || 0).toFixed(1)}h** avg (${r.resolved} resolved)`)
        .join('\n');
      return citeResult(
        `**${rows[0].name}** is the fastest department.\n${lines}`,
        [{ label: 'admin metrics', endpoint: '/api/admin/dept-metrics' }],
        { departments: rows }
      );
    }

    case 'top_hotspots': {
      const issues = db.prepare('SELECT lat, lng FROM issues').all();
      const grid = new Map();
      for (const i of issues) {
        const k = `${i.lat.toFixed(2)},${i.lng.toFixed(2)}`;
        grid.set(k, (grid.get(k) || 0) + 1);
      }
      const top = [...grid.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k, c], i) => `**#${i + 1}** [${k}] — ${c} reports`);
      return citeResult(
        top.length
          ? `Top hotspots:\n${top.join('\n')}`
          : 'No hotspots yet — need more reports clustered.',
        [{ label: 'AI hotspots', endpoint: '/api/ai/hotspots' }]
      );
    }

    case 'top_reporters': {
      const rows = db
        .prepare(
          `SELECT u.name, COUNT(i.id) c FROM users u
          LEFT JOIN issues i ON i.reporter_id = u.id
          GROUP BY u.id ORDER BY c DESC LIMIT 5`
        )
        .all();
      const lines = rows.map((r, i) => `${i + 1}. ${r.name} — **${r.c}** reports`).join('\n');
      return citeResult(`Top community heroes:\n${lines}`, [
        { label: 'leaderboard', endpoint: '/api/users/leaderboard' },
      ]);
    }

    case 'sla_breach': {
      const breaches = db
        .prepare(
          `SELECT id, title, sla_due_at FROM issues
           WHERE status NOT IN ('resolved','rejected') AND sla_due_at IS NOT NULL
             AND datetime(sla_due_at) < datetime('now')
           ORDER BY sla_due_at ASC LIMIT 10`
        )
        .all();
      if (!breaches.length)
        return citeResult('🎉 **Zero SLA breaches.** All open issues are within their service window.');
      return citeResult(
        `⚠️ **${breaches.length} SLA breaches** open:\n` +
          breaches.map((b) => `- ${b.title} (due ${b.sla_due_at})`).join('\n'),
        [{ label: 'admin breaches', endpoint: '/api/admin/breaches' }],
        { breaches }
      );
    }

    case 'help':
      return citeResult(
        `I can answer:\n` +
          `- "How many issues are open?"\n` +
          `- "How many were resolved?"\n` +
          `- "Which category is most reported?"\n` +
          `- "What's the sentiment trend?"\n` +
          `- "Which department is fastest?"\n` +
          `- "Show top hotspots"\n` +
          `- "Top community reporters"\n` +
          `- "Are there any SLA breaches?"`
      );

    default:
      return citeResult(
        `I'm not sure how to answer that yet. Try asking about open issues, sentiment, hotspots, departments, or SLA breaches. Type **"help"** to see all options.`
      );
  }
}

function citeResult(answer, citations = [], data) {
  return { answer, citations, data: data || null, ts: new Date().toISOString() };
}
