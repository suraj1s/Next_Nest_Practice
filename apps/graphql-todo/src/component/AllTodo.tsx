"use client";
import {
  useCreateBookMutation,
  useGetBookByIdQuery,
  useGetBookDataQuery,
} from "@/redux/redux-slice/book/bookApi";
// import { getBookById } from '@/graphql/Queries'
// import { useQuery } from '@apollo/client'
import React, { useEffect } from "react";

interface IBookType {
  id: number;
  title: string;
  price: number;
}

const AllTodo = () => {
  // const {error , loading , data } = useQuery(getBookById)
  const { data: graphqlData } = useGetBookDataQuery({});
  const bookData: IBookType[] = graphqlData?.data?.getAllBooks;
  console.log(bookData);
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

export const BookCard = ({ book }: any) => {
  return (
    <div className="border-3 border-gray-200 rounded-xl ">
      <hr />
      <br />
      <h1>{book?.id}</h1>
      <h1>{book?.title}</h1>
      <p>{book?.price}</p>
      <br />
    </div>
  );
};
