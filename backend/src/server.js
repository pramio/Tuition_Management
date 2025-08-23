import { connectDB } from './config/db.js';
import app from './app.js';
import { ensureAdmin } from '../scripts/createAdmin.js'; // fixed path and removed space

const PORT = process.env.PORT || 2001;

connectDB()
  .then(async () => {
    try {
      await ensureAdmin(); // run admin seeding
    } catch (e) {
      console.warn('[SEED] ensureAdmin failed:', e?.message);
    }

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((e) => {
    console.error('Failed to start server:', e?.message);
    process.exit(1);
  });
