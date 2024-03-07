"use client";
import { getBookById } from "@/graphql/Queries";
import { useQuery } from "@apollo/client";
import { bookData } from "./bookData";
import BookCard from "./BookCard";

const AllTodoApollo = () => {
  const { error, loading, data } = useQuery(getBookById);
  //   const bookData: IBookType[] = graphqlData?.data?.getAllBooks;
  const handelAddBook = () => {
    const bookData = {
      title: "this is new title",
      price: 9990,
    };
    // createBook({createBookData : {...bookData}})
  };
  return (
    <div className=" bg-slate-900 pt-10 text-gray-300 font-semibold  ">
        <h1>GraphQL Apollo</h1>
        <br />
      <button
        onClick={() => {
          console.log("add book ");
          handelAddBook();
        }}
      >
        Add Book
      </button>
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

export default AllTodoApollo;
