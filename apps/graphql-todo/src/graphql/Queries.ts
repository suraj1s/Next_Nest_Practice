import { gql } from "@apollo/client";

export const getBookById = gql`
query {
    getBookById(id: 1) {
      id
      title
      price
    }
  }
`
export const getAllBooks = gql`
query {
    getAllBooks{
      id,
      title,
      price
    }
  } 
`