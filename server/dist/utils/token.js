import jwt from 'jsonwebtoken';
export function signToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, secret, {
        expiresIn: '7d',
    });
}
export function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'object' && decoded !== null && 'email' in decoded && 'role' in decoded) {
            return decoded;
        }
        return null;
    }
    catch {
        return null;
    }
}
