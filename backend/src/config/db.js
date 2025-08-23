import mongoose from 'mongoose';

export const connectDB = async () => {
const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI missing');
const start = Date.now();
try {
await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'tuition' });
const ms = Date.now() - start;
console.log(`[DB] MongoDB connected → ${mongoose.connection.name} (${ms}ms)`);
} catch (err) {
console.error('[DB] MongoDB connection failed:', err.message);
throw err;
}
};

