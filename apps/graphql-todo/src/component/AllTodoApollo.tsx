"use client";
import { getAllBooks } from "@/graphql/Queries";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import BookCard, { IBookType } from "./BookCard";
import {
  CreateBookInput,
  addBookMutaion,
  signInUser,
} from "@/graphql/Mutations";
import { useEffect } from "react";

const AllTodoApollo = () => {
  const[ getAllBooksData, { data }] = useLazyQuery(getAllBooks);
  
  const [addBook] = useMutation<any, any>(addBookMutaion, {
    refetchQueries: [{ query: getAllBooks }],
  });
  const [loginUser, { data: loginData }] = useMutation<any, any>(signInUser);
  const bookData: IBookType[] = data?.getAllBooks;
  useEffect(() => {
    if (!loginData) return;
    const accessToken = loginData?.signin?.accessToken;
    const refreshToken = loginData?.signin?.refreshToken;
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    getAllBooksData()
  }, [loginData]);
useEffect(() => {
  getAllBooksData()
}, [])

  const handleAddBook = () => {
    const title = " book title 1";
    const price = 100;
    const bookData: CreateBookInput = {
      title,
      price,
    };
    // Execute the mutation with dynamic data
    addBook({ variables: { createBookData: bookData } });
  };

  return (
    <div className=" bg-slate-900 ">
      <div>
        login :{" "}
        <button
          onClick={() => {
            loginUser();
          }}
        >
          chick here
        </button>
      </div>
      <h1>GraphQL Apollo</h1>
      <br />
      <button
        onClick={() => {
          console.log("add book ");
          handleAddBook();
        }}
      >
        Add Book
      </button>
      <div className="">
        <br />
        {bookData?.map((item, index) => (
          <div key={index}>
            <BookCard book={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTodoApollo;
