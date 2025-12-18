export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

export type UserRequest = Omit<User, 'id' | 'createdAt'> & {
  password: string;
};

export type UserServer = User & {
  passwordHash: string;
};