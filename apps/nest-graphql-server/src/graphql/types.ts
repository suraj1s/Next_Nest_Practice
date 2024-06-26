
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateBookInput {
    title: string;
    price: number;
    status?: Nullable<string>;
}

export interface UpdateBookInput {
    id: number;
    title?: Nullable<string>;
    price?: Nullable<number>;
}

export interface CreateUserInput {
    email: string;
    name: string;
    password: string;
    age?: Nullable<number>;
}

export interface SignUpUserInput {
    email: string;
    name: string;
    password: string;
    age?: Nullable<number>;
}

export interface SignInUserInput {
    email: string;
    password: string;
}

export interface UserSetting {
    userId: number;
    recievedNotification: boolean;
}

export interface Book {
    id: number;
    title: string;
    price: number;
    status?: Nullable<string>;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    refreshToken?: Nullable<string>;
    userSetting?: Nullable<UserSetting>;
}

export interface AuthTokensResponse {
    accessToken: string;
    refreshToken: string;
}

export interface AccessTokenResponse {
    accessToken: string;
}

export interface LogoutResponse {
    message: string;
}

export interface UserResponse {
    id: number;
    email: string;
    name: string;
    refreshToken: string;
}

export interface IQuery {
    getAllBooks(): Book[] | Promise<Book[]>;
    getBookById(id: number): Book | Promise<Book>;
    getUsers(): User[] | Promise<User[]>;
    getUserById(id: number): Nullable<User> | Promise<Nullable<User>>;
    profile(): UserResponse | Promise<UserResponse>;
}

export interface IMutation {
    addBook(createBookData: CreateBookInput): Book | Promise<Book>;
    updateBook(updateBookData: UpdateBookInput): Book | Promise<Book>;
    deleteBook(id: number): string | Promise<string>;
    createUser(createUserData: CreateUserInput): User | Promise<User>;
    updateUser(id: number, updateUserData: CreateUserInput): User | Promise<User>;
    signup(authPayload: SignUpUserInput): AuthTokensResponse | Promise<AuthTokensResponse>;
    signin(data: SignInUserInput): AuthTokensResponse | Promise<AuthTokensResponse>;
    refreshTokens(userId: number): AccessTokenResponse | Promise<AccessTokenResponse>;
    logout(): LogoutResponse | Promise<LogoutResponse>;
}

type Nullable<T> = T | null;
