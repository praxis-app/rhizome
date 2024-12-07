import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { appRouter } from './app.routes';
import { cacheService } from './cache/cache.service';
import { dataSource } from './database/data-source';
import { WebSocketServerWithIds } from './pub-sub/pub-sub.models';
import { pubSubService } from './pub-sub/pub-sub.service';

dotenv.config();

(async () => {
  const app = express();
  const server = createServer(app);
  const webSocketServer = new WebSocketServerWithIds({ path: '/ws', server });

  await cacheService.initializeCache();
  await dataSource.initialize();

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(cors());

  // Serve static files and API routes
  app.use(express.static(join(__dirname, './view')));
  app.use('/api', appRouter);

  // Catch-all route to serve index.html for SPA routing
  app.get(/(.*)/, (_, res) => {
    res.sendFile(join(__dirname, './view', 'index.html'));
  });

  // Handle web socket connections with pub-sub service
  webSocketServer.on('connection', (webSocket) => {
    webSocket.on('message', (data) =>
      pubSubService.handleMessage(webSocket, data),
    );
    webSocket.on('error', console.error);
  });

  server.listen(process.env.SERVER_PORT);
  console.log(
    `Server running at http://localhost:${process.env.SERVER_PORT} 🚀`,
  );
})();
