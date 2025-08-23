import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// Signup
router.post('/signup', async (req, res, next) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) {
return res.status(400).json({ message: 'Name, email, and password are required' });
}
const existingUser = await User.findOne({ email });
if (existingUser) return res.status(409).json({ message: 'Email already registered' });

const user = await User.create({ name, email, password, role: 'admin' });
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
} catch (error) { next(error); }
});

// Login
router.post('/login', async (req, res, next) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid email or password' });

const validPassword = await user.compare(password);
if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
} catch (error) { next(error); }
});

export default router;

