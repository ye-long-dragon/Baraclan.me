import path from 'node:path';
import dotenv from 'dotenv';

// Resolve from server folder and from repo root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import app from './app.js';
import { connectToDatabase } from './database/connection.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      console.log('📦 Connected to MongoDB successfully.');
    } catch (err) {
      console.error('⚠️ Could not connect to MongoDB on startup:', err);
    }
  } else {
    console.warn('⚠️ No MONGODB_URI found in environment. Running in offline/detached mode.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

startServer();
