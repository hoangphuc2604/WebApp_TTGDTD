export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    status: number;
    token: string;
    user: User;
}
const mockUsersDatabase = [
    {
        id: "US01",
        email: "user@gmail.com",
        password: "123",
        name: "Nguyễn Văn A",
        role: "Người dùng",
    }
];

export const fakePostLoginAPI = (credentials) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsersDatabase.find(
                user => user.email === credentials.email && user.password === credentials.password);
            if(user) {
                const { password, ...userWithoutPassword} = user;
                resolve({
                    status: "success",
                    token: "fake-jwt-token-education-2026",
                    user: userWithoutPassword,
                });
            } else {
                reject(new Error("Email hoặc mật khẩu không chính xác!"));
            }
        },1000);
    });
}