/**
 * Lightweight rule-based sentiment scoring.
 * Returns { score: -1..1, label: 'negative' | 'neutral' | 'positive' }.
 *
 * In production, swap in a real model (HuggingFace, OpenAI, or a small
 * on-device transformer). The contract stays identical.
 */

const NEG = [
  'broken','dangerous','danger','urgent','hazard','terrible','awful','disgusting',
  'overflowing','flooded','crumbling','cracked','leaking','smell','stink','filthy',
  'unsafe','injury','injured','trapped','collapsed','rotten','dirty','sewage',
  'unbearable','ignored','frustrated','angry','complaint','useless','furious',
];

const POS = [
  'fixed','resolved','clean','smooth','great','excellent','beautiful','quick',
  'thanks','grateful','appreciate','restored','improved','timely','efficient',
];

const URGENT = ['emergency','injured','death','collapse','fire','flood','toxic'];

export function analyzeSentiment(text = '') {
  const t = text.toLowerCase();
  let neg = 0;
  let pos = 0;
  let urgentBoost = 0;

  for (const w of NEG) if (t.includes(w)) neg++;
  for (const w of POS) if (t.includes(w)) pos++;
  for (const w of URGENT) if (t.includes(w)) urgentBoost += 1.5;

  const total = neg + pos || 1;
  const raw = (pos - neg) / total - urgentBoost * 0.2;
  const score = Math.max(-1, Math.min(1, raw));

  let label = 'neutral';
  if (score <= -0.25) label = 'negative';
  else if (score >= 0.25) label = 'positive';

  return { score: Number(score.toFixed(3)), label };
}

export function aggregateSentiment(items = []) {
  if (!items.length) return { avg: 0, label: 'neutral', counts: { negative: 0, neutral: 0, positive: 0 } };
  const counts = { negative: 0, neutral: 0, positive: 0 };
  let sum = 0;
  for (const it of items) {
    sum += Number(it.sentiment) || 0;
    counts[it.sentiment_label || 'neutral']++;
  }
  const avg = sum / items.length;
  let label = 'neutral';
  if (avg <= -0.2) label = 'negative';
  else if (avg >= 0.2) label = 'positive';
  return { avg: Number(avg.toFixed(3)), label, counts };
}
