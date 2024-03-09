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

export const signInUser = gql`
mutation {
  signin(data: {
    email: "ram@gmail.com"
    password: "ram",
  }){
    accessToken,
    refreshToken
  }
}
`;

export interface CreateBookInput {
  title: string;
  price: number;
}

