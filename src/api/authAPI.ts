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
export interface ProfileResponse {
    status: number;
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

export const fakePostLoginAPI = (credentials: LoginCredentials) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsersDatabase.find(
                user => user.email === credentials.email && user.password === credentials.password);
            if(user) {
                const { password, ...userWithoutPassword} = user;
                resolve({
                    status: 200,
                    token: "fake-jwt-token-education-2026",
                    user: userWithoutPassword,
                });
            } else {
                reject(new Error("Email hoặc mật khẩu không chính xác!"));
            }
        },1000);
    });
}
export const fakeGetProfileApi = (token: string):Promise<ProfileResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token==="fake-jwt-token-education-2026") {
                const {password, ...userWithoutPassword} = mockUsersDatabase[0];
                resolve({
                    status: 200,
                    user: userWithoutPassword
                });
            } else {
                reject(new Error("Not found profile"));
            }
        }, 500);
    })
}