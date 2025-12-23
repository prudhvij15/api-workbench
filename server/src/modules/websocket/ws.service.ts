import WebSocket from 'ws';
import { randomUUID } from 'crypto';

type Direction = 'IN' | 'OUT';
type MessageType = 'SYSTEM' | 'DATA';

export type WsMessage = {
  id: string;
  data: string;
  direction: Direction;
  type: MessageType;
  timestamp: string;
  latencyMs?: number;
};

const sockets = new Map<string, WebSocket>();
const messages = new Map<string, WsMessage[]>();
const sentTimestamps = new Map<string, Map<string, number>>();
const firstMessageFlag = new Map<string, boolean>();

// CONNECT
export function connectWebSocketService(url: string) {
  return new Promise<{ connectionId: string }>((resolve, reject) => {
    const connectionId = randomUUID();
    const ws = new WebSocket(url);

    sockets.set(connectionId, ws);
    messages.set(connectionId, []);
    sentTimestamps.set(connectionId, new Map());
    firstMessageFlag.set(connectionId, true);

    ws.on('open', () => {
      resolve({ connectionId });
    });

    ws.on('message', (data) => {
      const now = Date.now();
      const isFirst = firstMessageFlag.get(connectionId) ?? false;

      const msg: WsMessage = {
        id: randomUUID(),
        data: data.toString(),
        direction: 'IN',
        type: isFirst ? 'SYSTEM' : 'DATA',
        timestamp: new Date().toISOString()
      };

      // ---- SAFE LATENCY CALCULATION ----
      if (!isFirst) {
        const sentMap = sentTimestamps.get(connectionId);
        const iterator = sentMap?.entries().next();

        if (iterator && !iterator.done) {
          const [messageId, sentTime] = iterator.value;
          msg.latencyMs = now - sentTime;
          sentMap?.delete(messageId);
        }
      }

      messages.get(connectionId)?.push(msg);
      firstMessageFlag.set(connectionId, false);
    });

    ws.on('close', () => {
      sockets.delete(connectionId);
      sentTimestamps.delete(connectionId);
      firstMessageFlag.delete(connectionId);
    });

    ws.on('error', (err) => {
      reject(err);
    });
  });
}

// SEND
export function sendWebSocketMessage(
  connectionId: string,
  data: string
) {
  const ws = sockets.get(connectionId);
  if (!ws) {
    throw new Error('Invalid connectionId');
  }

  const messageId = randomUUID();
  const sentTime = Date.now();

  sentTimestamps.get(connectionId)?.set(messageId, sentTime);

  const msg: WsMessage = {
    id: messageId,
    data,
    direction: 'OUT',
    type: 'DATA',
    timestamp: new Date().toISOString()
  };

  messages.get(connectionId)?.push(msg);
  ws.send(data);
}

// GET MESSAGES
export function getWebSocketMessages(connectionId: string) {
  return messages.get(connectionId) ?? [];
}
