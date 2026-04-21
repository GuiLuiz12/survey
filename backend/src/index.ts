import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import surveyRoutes from './routes/survey';
import { connectDB, disconnectDB } from './db';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdlc-survey';

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';
app.set('trust proxy', 1);
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api', surveyRoutes);

async function start(): Promise<void> {
  await connectDB(MONGODB_URI);

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.on(signal, () => {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  }
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
