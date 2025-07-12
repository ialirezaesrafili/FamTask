import dotenv from 'dotenv';
import Application from './app.js';

// Load environment variables first
dotenv.config();

const app = new Application();
app.start();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    console.log(`\n[Server] Received ${signal}, shutting down`);
    await app.shutdown();
    process.exit(0);
  });
});