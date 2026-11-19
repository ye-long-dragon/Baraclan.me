import mongoose from 'mongoose';
let cached = globalThis.mongooseCache || {
    conn: null,
    promise: null,
};
if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = cached;
}
export async function connectToDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is missing.');
    }
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            bufferCommands: false,
        });
    }
    try {
        cached.conn = await cached.promise;
        return cached.conn;
    }
    catch (error) {
        cached.promise = null;
        throw error;
    }
}
