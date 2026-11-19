import type { Request, Response, NextFunction, RequestHandler } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { loginSchema } from '../utils/validators.js';
import { signToken, verifyToken, type AdminTokenPayload } from '../utils/token.js';

export const COOKIE_NAME = 'admin_token';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

function constantTimeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a.trim().toLowerCase()).digest();
  const hashB = crypto.createHash('sha256').update(b.trim().toLowerCase()).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export const loginCheck: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const { email, password } = parseResult.data;
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

  if (!adminEmail || !adminPasswordHash) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const emailMatches = constantTimeCompare(email, adminEmail);
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);

  if (!emailMatches || !passwordMatches) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({ email: adminEmail, role: 'admin' });
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    email: adminEmail,
  });
};

export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Admin access required' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ message: 'Unauthorized: Admin access required' });
    return;
  }

  req.admin = payload;
  next();
};

export const logoutCheck: RequestHandler = (_req: Request, res: Response): void => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
