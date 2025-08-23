import User from '../src/models/User.js';

export const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME || 'Admin';
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('[SEED] Skipping admin seed: ADMIN_EMAIL or ADMIN_PASSWORD missing');
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[SEED] Admin exists → ${email}`);
    return;
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`[SEED] Admin created → ${email}`);
};
