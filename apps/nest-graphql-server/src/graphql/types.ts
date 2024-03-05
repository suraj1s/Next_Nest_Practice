
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
}

export interface UpdateBookInput {
    id: number;
    title?: Nullable<string>;
    price?: Nullable<number>;
}

export interface CreateUserInput {
    username: string;
    password: string;
    age?: Nullable<number>;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    nickName?: Nullable<string>;
    refreshToken?: Nullable<string>;
}

export interface Book {
    id: number;
    title: string;
    price: number;
}

export interface IQuery {
    getAllBooks(): Book[] | Promise<Book[]>;
    getBookById(id: number): Book | Promise<Book>;
    getUsers(): User[] | Promise<User[]>;
    getUserById(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    addBook(createBookData: CreateBookInput): Book | Promise<Book>;
    updateBook(updateBookData: UpdateBookInput): Book | Promise<Book>;
    deleteBook(id: number): string | Promise<string>;
    createUser(createUserData: CreateUserInput): User | Promise<User>;
}

type Nullable<T> = T | null;
