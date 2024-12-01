import express from 'express';
import { authRouter } from './auth/auth.routes';
import { healthRouter } from './health/health.routes';

export const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/health', healthRouter);
