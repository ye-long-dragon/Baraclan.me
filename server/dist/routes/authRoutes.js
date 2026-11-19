import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginCheck, logoutCheck, requireAdmin } from '../middleware/auth.js';
import { me } from '../controllers/authController.js';
export const authRoutes = Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' },
});
authRoutes.post('/login', loginLimiter, loginCheck);
authRoutes.post('/logout', logoutCheck);
authRoutes.get('/me', requireAdmin, me);
