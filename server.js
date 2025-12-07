import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force-load .env from this folder
dotenv.config({ path: path.join(__dirname, '.env') });

// Show which URI is used (mask password)
const rawUri = process.env.MONGODB_URI || '';
const masked = rawUri.replace(/\/\/([^:]+):([^@]+)@/, (_, u) => `//${u}:****@`);
console.log('Using Mongo URI:', masked || '(empty)');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// API routes
import postsRouter from './routes/posts.js';
app.use('/api/posts', postsRouter);

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Connect to MongoDB (non-blocking)
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogdb';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Start HTTP server (IMPORTANT)
const port = process.env.PORT || 4000;
const host = '0.0.0.0'; // bind to all interfaces (works on Windows)
const server = app.listen(port, host, () => {
  console.log(`Server running on http://localhost:${port}`);
});
server.on('error', (err) => {
  console.error('HTTP server error:', err);
});

// Extra crash visibility
process.on('unhandledRejection', (r) => console.error('unhandledRejection', r));
process.on('uncaughtException', (e) => console.error('uncaughtException', e));
