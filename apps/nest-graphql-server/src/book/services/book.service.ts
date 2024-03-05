import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../graphql/book.schema';
import { Repository } from 'typeorm';
import { CreateBookInput } from '../utils/type';

@Injectable()
export class BookService {
  constructor(
    // all repositories are asynchronous and return a promise
    @InjectRepository(Book) public readonly bookModle: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookModle.find();
  }

  async findOne(id: number): Promise<Book> {
    return this.bookModle.findOne({ where: { id } });
  }

  async create(bookData: CreateBookInput): Promise<Book> {
    let book = new Book();
    book.title = bookData.title;
    book.price = bookData.price;
    return this.bookModle.save(book);
    // await this.bookModle.save(book);
    // const newBook = this.bookModle.create(bookData);
    // return this.bookModle.save(newBook);
  }

  async update(id: number, book: Book): Promise<Book> {
    await this.bookModle.update(id, book);
    return this.bookModle.findOne({ where: { id } });
  }

  async remove(id: number): Promise<string> {
    await this.bookModle.delete(id);
    return `Book of id :  ${id} is deleted successfully`;
  }
}
