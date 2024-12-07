import express from 'express';
import { healthRouter } from './health/health.routes';

export const appRouter = express.Router();

appRouter.use('/health', healthRouter);
