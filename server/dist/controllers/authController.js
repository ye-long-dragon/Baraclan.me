import { loginCheck, logoutCheck } from '../middleware/auth.js';
export const login = loginCheck;
export const logout = logoutCheck;
export function me(req, res) {
    const adminEmail = req.admin?.email || process.env.ADMIN_EMAIL;
    res.json({
        authenticated: true,
        email: adminEmail,
        role: 'admin',
    });
}
