import { Query, Resolver } from '@nestjs/graphql';
import { Book } from '../graphql/book.schema';
// this is resolver used to resolve the query i.e the main logic that will be executed when the query is called to fetch the data form the database

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
}
