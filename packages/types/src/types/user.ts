export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

type UserBase = Omit<User, 'id' | 'createdAt'>;

export type UserWithPassword<T extends 'password' | 'passwordHash'> = UserBase
  & (T extends 'password'
      ? { password: string }
      : { passwordHash: string });

export type UserServer = User & {
  passwordHash: string;
};