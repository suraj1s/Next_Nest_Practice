// // Purpose: final filtered data form request body ready to be saved in the db

export type CreateUserParams = {
  email: string;
  name: string;
  password: string;
  age?: number;
};

export type UpdateUserParams = {
  email?: string;
  name?: string;
  password?: string;
  age?: number;
  refreshToken?: string;
};

export type UserValidation = {
  email: string;
  password: string;
  id: number;
};
