import { gql } from "@apollo/client";

export const addBookMutaion = gql`
  mutation addBook($createBookData: CreateBookInput!) {
    addBook(createBookData: $createBookData) {
      id
      title
      price
    }
  }
`;

export interface CreateBookInput {
  title: string;
  price: number;
}

