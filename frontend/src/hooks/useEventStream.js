/**
 * useEventStream — subscribe to the backend SSE feed (/api/stream).
 *
 * Auto-reconnects (EventSource does this natively), exposes a `connected`
 * flag, and calls `onEvent(parsedEvent)` for every server event. One stream
 * per hook instance; mount it once near the app root for global live updates.
 */
import { useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || '';

export function useEventStream(onEvent) {
  const [connected, setConnected] = useState(false);
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    const es = new EventSource(`${BASE}/api/stream`);
    const types = [
      'issue.created', 'issue.status', 'issue.assigned',
      'issue.resolved', 'issue.duplicate', 'pulse.signal', 'sla.breach',
    ];

    es.addEventListener('hello', () => setConnected(true));
    es.onerror = () => setConnected(false);

    const dispatch = (e) => {
      try {
        handlerRef.current?.(JSON.parse(e.data));
      } catch {
        /* ignore malformed frames */
      }
    };
    types.forEach((t) => es.addEventListener(t, dispatch));

    return () => es.close();
  }, []);

  return { connected };
}
