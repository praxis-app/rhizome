import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { join } from 'path';
import { appRouter } from './app.router';
import * as cacheService from './cache/cache.service';
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

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(morgan('dev'));
  app.use(cors());

  // Serve static files and API routes
  app.use(express.static(join(__dirname, './view')));
  app.use('/api', appRouter);

  // Add error handling middleware for all routes
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send(err.message);
    console.error(err);
  });

  // Catch-all route to serve index.html for SPA routing
  app.get(/(.*)/, (_, res) => {
    res.sendFile(join(__dirname, './view', 'index.html'));
  });

  // Handle web socket connections with pub-sub service
  webSocketServer.on('connection', (webSocket) => {
    webSocket.on('message', (data) => pubSubService.handleMessage(webSocket, data));
    webSocket.on('error', console.error);
  });

  server.listen(process.env.SERVER_PORT);
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT} 🚀`);
})();
