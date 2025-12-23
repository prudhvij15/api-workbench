import Fastify from 'fastify';
import { healthRoute } from './src/modules/health/health.routes';
import { restRoute } from './src/modules/rest/rest.routes';
import { wsRoute } from './src/modules/websocket/ws.route';

export function buildApp() {
  const app = Fastify();

  app.register(healthRoute);

  app.register(restRoute)
  app.register(wsRoute)

  return app;
}