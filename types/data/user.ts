interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface UserCreate {
    userName: string;
    email: string;
    password: string;
}

interface UserReturn {
    id: string;
    first_name: string;
    last_name?: string;
    email: string;
}

interface UserInfoReturn extends UserReturn {
    createdAt: string;
    isVerified: boolean;
}

interface UserLogin {
    email: string;
    password: string;
}

interface PasswordRequestReset {
    email: string;
}

interface NewUserPassword {
    accessToken: string;
    tokenType: 'Bearer';
    password: string;
}
