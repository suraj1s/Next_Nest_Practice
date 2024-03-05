import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Book } from '../graphql/book.schema';
import { CreateBookInput, UpdateBookInput } from '../utils/type';
import { create } from 'domain';
import { BookService } from '../services/book.service';
// this is resolver used to resolve the query i.e the main logic that will be executed when the query is called to fetch the data form the database

// code first approach

@Resolver((of) => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query((returns) => [Book], { name: 'getAllBooks' })
  async getAllBooks() {
    const books = await this.bookService.findAll();
    return books;
  }

  @Query((returns) => Book, { name: 'getBookById' })
  getBookById(@Args('id') id: number) {
    return this.bookService.findOne(id);
  }
  @Mutation((returns) => Book, { name: 'addBook' })
  async addBook(@Args('createBookData') createBookData: CreateBookInput) {
    const createdBook = await this.bookService.create(createBookData);
    return createdBook;
  }

  @Mutation((returns) => Book, { name: 'updateBook' })
  updateBook(
    // @Args('id') id: number,
    // @Args('title') title: string,
    // @Args('price') price: number,
    @Args('updateBookData') updateBookData: UpdateBookInput,
  ) {
    return this.bookService.update(updateBookData.id, updateBookData);
  }

  @Mutation((returns) => String, { name: 'deleteBook' })
  deleteBook(@Args('id') id: number) {
    return this.bookService.remove(id);
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
