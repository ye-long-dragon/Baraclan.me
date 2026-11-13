export interface User {
    _id?: string;
    email: string;
    password?: string; // BCRYPT hashed in backend
    rePassword?: string;
    name?: string;
    role?: 'admin' | 'user';
    img?: string;
    createdAt?: string;
}
