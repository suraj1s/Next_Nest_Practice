
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

export interface Book {
    id: number;
    title: string;
    price: number;
}

export interface IQuery {
    getAllBooks(): Book[] | Promise<Book[]>;
    getBookById(id: number): Book | Promise<Book>;
}

export interface IMutation {
    addBook(createBookData: CreateBookInput): Book | Promise<Book>;
    updateBook(updateBookData: UpdateBookInput): Book | Promise<Book>;
    deleteBook(id: number): Book[] | Promise<Book[]>;
}

type Nullable<T> = T | null;
