import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import studentsRoutes from './routes/students.routes.js';
import batchesRoutes from './routes/batches.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import feesRoutes from './routes/fees.routes.js';
import examsRoutes from './routes/exams.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.send('Welcome to the Tuition Management API'));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/batches', batchesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;

