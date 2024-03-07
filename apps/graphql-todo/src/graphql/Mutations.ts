import { gql } from "@apollo/client";


export const addBookMutaiton = gql`
mutation {
    addBook(createBookData: {
      title: "This is book title",
      price: 499,    
    }) {
      id
      title
      price 
    }
  }`
