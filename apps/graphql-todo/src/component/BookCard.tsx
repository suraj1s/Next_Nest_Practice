import React from "react";

export interface IBookType {
  id: number;
  title: string;
  price: number;
}
type Props = {
  book: IBookType;
};

const BookCard = ({ book }: Props) => {
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

export default BookCard;
