import { Module } from '@nestjs/common';
import { BookResolver } from './resolvers/book.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './graphql/book.schema';
import { BookService } from './services/book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [],
  providers: [BookService, BookResolver],
})
export class BookModule {}
