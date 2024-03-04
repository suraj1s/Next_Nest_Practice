import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from '../graphql/book.schema';
import { CreateBookInput, UpdateBookInput } from '../utils/type';
import { create } from 'domain';
// this is resolver used to resolve the query i.e the main logic that will be executed when the query is called to fetch the data form the database

// code first approach
const bookData = [
  {
    id: 1,
    title: 'The Hobbit',
    price: 9,
  },
  {
    id: 2,
    title: 'The Lord of the Rings',
    price: 19,
  },
];

@Resolver((of) => Book)
export class BookResolver {
  constructor() {}

  @Query((returns) => [Book])
  getAllBooks() {
    return bookData;
  }

  @Query((returns) => Book)
  getBookById(@Args('id') id: number) {
    return bookData.find((book) => book.id === id);
  }
  @Mutation((returns) => Book)
  addBook(@Args('createBookData') createBookData: CreateBookInput) {
    const { title, price } = createBookData;
    const newBook = {
      id: bookData.length + 1,
      title,
      price,
    };
    bookData.push(newBook);
    return newBook;
  }

  @Mutation((returns) => Book)
  updateBook(
    // @Args('id') id: number,
    // @Args('title') title: string,
    // @Args('price') price: number,
    @Args('updateBookData') updateBookData: UpdateBookInput,
  ) {
    const { id, title, price } = updateBookData;
    const book = bookData.find((book) => book.id === id);
    if (book) {
      book.title = title;
      book.price = price;
    }
    return book;
  }

  @Mutation((returns) => [Book])
  deleteBook(@Args('id') id: number) {
    const newBook = bookData.filter((book) => book.id !== id);
    return newBook;
  }
}

// schema first approach
// @Resolver('Book')
// export class BookResolver {
//   constructor() {}

//   @Query('getAllBooks')
//   getAllBooks() {
//     return [
//       {
//         id: 1,
//         title: 'The Hobbit',
//         price: 9.99,
//       },
//       {
//         id: 2,
//         title: 'The Lord of the Rings',
//         price: 19.99,
//       },
//     ];
//   }
// }
