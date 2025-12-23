import { FastifyRequest, FastifyReply } from 'fastify';
import {
  connectWebSocketService,
  sendWebSocketMessage,
  getWebSocketMessages
} from './ws.service';
import { evaluateAssertions } from './ws.assertions.engine';

export async function connectWebSocket(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { url } = request.body as any;
  if (!url) {
    reply.code(400);
    return { error: 'url required' };
  }

  return connectWebSocketService(url);
}

export async function sendWebSocket(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { connectionId, message } = request.body as any;
  if (!connectionId || !message) {
    reply.code(400);
    return { error: 'connectionId and message required' };
  }

  sendWebSocketMessage(connectionId, message);
  return { status: 'sent' };
}

export async function getMessages(
  request: FastifyRequest
) {
  const { connectionId } = request.query as any;
  return getWebSocketMessages(connectionId);
}




export async function runAssertions(
  request: any,
  reply: any
) {
  const { connectionId, assertions } = request.body;

  if (!connectionId || !assertions) {
    reply.code(400);
    return { error: 'connectionId and assertions are required' };
  }

  const messages = getWebSocketMessages(connectionId);
  const results = evaluateAssertions(messages, assertions);

  return { results };
}