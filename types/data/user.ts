export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface UserCreate {
    userName: string;
    email: string;
    password: string;
}

export interface UserReturn {
    id: string;
    first_name: string;
    last_name?: string;
    email: string;
}

export interface UserInfoReturn extends UserReturn {
    createdAt: string;
    isVerified: boolean;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface PasswordRequestReset {
    email: string;
}

export interface NewUserPassword {
    accessToken: string;
    tokenType: 'Bearer';
    password: string;
}
