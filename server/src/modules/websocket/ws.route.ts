import { FastifyInstance } from 'fastify';
import {
  connectWebSocket,
  sendWebSocket,
  getMessages,
  runAssertions
} from './ws.controller';

export async function wsRoute(app: FastifyInstance) {
  app.post('/ws/connect', connectWebSocket);
  app.post('/ws/send', sendWebSocket);
  app.get('/ws/messages', getMessages);
  app.post('/ws/assert', runAssertions);

}
