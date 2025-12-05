export type UserInfo = {
    email: string;
    login: string;
    firstName: string;
    lastName: string;
};

export type UserRequest = UserInfo & { password: string };

export type UserData = UserInfo & {
    id: string;
    createdAt: Date;
};