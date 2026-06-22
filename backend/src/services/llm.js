/**
 * Pluggable LLM service.
 * Supports: openai | groq | ollama | mock (default for hackathon demo with no key)
 */
import OpenAI from 'openai';

const PROVIDER = (process.env.LLM_PROVIDER || 'mock').toLowerCase();

const SYSTEM = `You are an AI civic-issue analyst for the Community Hero platform.
You receive a citizen's report about a local problem (potholes, streetlights, water,
waste, infrastructure, etc.). Respond with STRICT JSON only:
{
  "category": "pothole|streetlight|water|waste|infrastructure|other",
  "severity": 1-5,
  "tags": ["short", "tags"],
  "summary": "one-line summary for the city dashboard",
  "department": "which municipal department should handle it"
}`;

function mockAnalyze(text) {
  const lower = (text || '').toLowerCase();
  let category = 'other';
  if (/pothole|road|crack/.test(lower)) category = 'pothole';
  else if (/light|lamp|dark/.test(lower)) category = 'streetlight';
  else if (/water|leak|pipe|flood/.test(lower)) category = 'water';
  else if (/garbage|trash|waste|dumpster|bin/.test(lower)) category = 'waste';
  else if (/sidewalk|pavement|bridge|manhole|sign/.test(lower)) category = 'infrastructure';

  const severity = /danger|urgent|hazard|emergency|injur/.test(lower) ? 5 : 3;
  return {
    category,
    severity,
    tags: [category, severity >= 4 ? 'urgent' : 'standard'],
    summary: `${category} reported by citizen — ${severity >= 4 ? 'urgent' : 'standard'} priority.`,
    department: deptFor(category),
  };
}

function deptFor(c) {
  return (
    {
      pothole: 'Roads & Highways',
      streetlight: 'Electrical',
      water: 'Water & Sewerage',
      waste: 'Sanitation',
      infrastructure: 'Public Works',
    }[c] || 'General Civic'
  );
}

async function openaiAnalyze(text) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: text },
    ],
  });
  return JSON.parse(res.choices[0].message.content);
}

async function groqAnalyze(text) {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  const res = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: text },
    ],
  });
  return JSON.parse(res.choices[0].message.content);
}

async function ollamaAnalyze(text) {
  const url = `${process.env.OLLAMA_URL || 'http://localhost:11434'}/api/chat`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'llama3.1',
      stream: false,
      format: 'json',
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: text },
      ],
    }),
  });
  const data = await r.json();
  return JSON.parse(data.message.content);
}

export async function analyzeIssue(text) {
  try {
    let result;
    if (PROVIDER === 'openai' && process.env.OPENAI_API_KEY) result = await openaiAnalyze(text);
    else if (PROVIDER === 'groq' && process.env.GROQ_API_KEY) result = await groqAnalyze(text);
    else if (PROVIDER === 'ollama') result = await ollamaAnalyze(text);
    else result = mockAnalyze(text);

    // Safety: ensure required fields
    return {
      category: result.category || 'other',
      severity: Math.min(5, Math.max(1, Number(result.severity) || 3)),
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 6) : [],
      summary: result.summary || 'Citizen-reported issue.',
      department: result.department || deptFor(result.category),
    };
  } catch (e) {
    console.warn('LLM failed, falling back to mock:', e.message);
    return mockAnalyze(text);
  }
}

export async function predictHotspots(issues) {
  // Simple density-based clustering for demo. In production use DBSCAN or H3.
  const grid = new Map();
  for (const i of issues) {
    const key = `${i.lat.toFixed(2)},${i.lng.toFixed(2)}`;
    grid.set(key, (grid.get(key) || 0) + 1);
  }
  return [...grid.entries()]
    .filter(([, c]) => c >= 2)
    .map(([k, c]) => {
      const [lat, lng] = k.split(',').map(Number);
      return { lat, lng, count: c, risk: Math.min(1, c / 5) };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
