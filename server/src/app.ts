import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './database/connection.js';
import { authRoutes } from './routes/authRoutes.js';
import { portfolioRoutes } from './routes/portfolioRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security and utility middleware
app.use(helmet());

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

// Ensure DB is connected for /api calls
app.use('/api', async (_req, _res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', portfolioRoutes);

// Central error handler (never leaks stack traces or DB details)
app.use(errorHandler);

export default app;
