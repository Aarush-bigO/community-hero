/**
 * In-process event bus for real-time notifications.
 *
 * Every meaningful state change (new issue, status change, assignment,
 * resolution, new pulse signal, SLA breach) is published here. The SSE
 * route (`/api/stream`) subscribes and fans out to connected browsers,
 * giving the platform live push notifications without a websocket server
 * or an external broker — production can swap this for Redis pub/sub.
 */
import { EventEmitter } from 'node:events';

class CivicBus extends EventEmitter {}

export const bus = new CivicBus();
bus.setMaxListeners(0); // unbounded SSE subscribers

/**
 * Publish a typed event. `type` is a short machine string the frontend
 * switches on; `payload` is any JSON-serialisable object.
 */
export function publish(type, payload = {}) {
  const event = {
    id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    type,
    payload,
    ts: new Date().toISOString(),
  };
  bus.emit('event', event);
  return event;
}

export const EVENTS = {
  ISSUE_CREATED: 'issue.created',
  ISSUE_STATUS: 'issue.status',
  ISSUE_ASSIGNED: 'issue.assigned',
  ISSUE_RESOLVED: 'issue.resolved',
  ISSUE_DUPLICATE: 'issue.duplicate',
  PULSE_SIGNAL: 'pulse.signal',
  SLA_BREACH: 'sla.breach',
};
