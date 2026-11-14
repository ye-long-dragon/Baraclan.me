export type UserForm = {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    role: 'admin' | 'user';
    img: string;
};
