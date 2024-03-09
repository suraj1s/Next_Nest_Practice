"use client";
import { getAllBooks } from "@/graphql/Queries";
import { useMutation, useQuery } from "@apollo/client";
import BookCard, { IBookType } from "./BookCard";
import {
  CreateBookInput,
  addBookMutaion,
  signInUser,
} from "@/graphql/Mutations";
import { useEffect } from "react";

const AllTodoApollo = () => {
  const { data } = useQuery(getAllBooks);
  const [addBook] = useMutation<any, any>(addBookMutaion, {
    refetchQueries: [{ query: getAllBooks }],
  });
  const [loginUser, { data: loginData }] = useMutation<any, any>(signInUser);
  const bookData: IBookType[] = data?.getAllBooks;
  console.log(bookData, "form apollo");

  useEffect(() => {
    const accessToken = loginData?.signin?.accessToken;
    const refreshToken = loginData?.signin?.refreshToken;
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [loginData]);

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
