"use client";
import {
  useCreateBookMutation,
  useGetBookDataQuery,
} from "@/redux/redux-slice/book/bookApi";
import React, { useEffect } from "react";
import BookCard, { IBookType } from "./BookCard";

const AllTodo = () => {
  const { data: graphqlData } = useGetBookDataQuery({});
  const bookData: IBookType[] = graphqlData?.data?.getAllBooks;
  const [createBook] = useCreateBookMutation();
  const handelAddBook = ()=> {
    const bookData = {
      title : "this is new title",
      price : 9990
    }
    createBook({createBookData : {...bookData}})
  }
  return (
    <div className=" bg-slate-900 pt-10 text-gray-300 font-semibold  ">
      <h1>GraphQL RTK</h1>
        <br />
      <button onClick={()=> {
        console.log("add book ")
        handelAddBook()
      }}>Add Book</button>
      <div className="flex flex-wrap gap-10">
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

export default AllTodo;
