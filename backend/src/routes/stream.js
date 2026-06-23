/**
 * Server-Sent Events stream — real-time push to the browser.
 *
 *   GET /api/stream            → all events
 *   GET /api/stream?muni=demo-city  → filter by municipality (best-effort)
 *
 * Each browser keeps one EventSource open; the bus fans events out to all
 * of them. Heartbeats every 25s keep proxies from closing idle connections.
 */
import { Router } from 'express';
import { bus } from '../services/events.js';

const router = Router();

router.get('/', (req, res) => {
  const muni = req.query.muni;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write(`event: hello\ndata: ${JSON.stringify({ ok: true, ts: Date.now() })}\n\n`);

  const onEvent = (event) => {
    if (muni && event.payload?.municipality_id && event.payload.municipality_id !== muni) return;
    res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  };

  bus.on('event', onEvent);

  const heartbeat = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 25_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    bus.off('event', onEvent);
    res.end();
  });
});

export default router;
