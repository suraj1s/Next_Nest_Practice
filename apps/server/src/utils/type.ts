// // Purpose: final filtered data form request body ready to be saved in the db  

export type CreateUserParams = {
  userName: string;
  password: string;
};

export type UpdateUserParams = {
  userName?: string;
  password?: string;
};
