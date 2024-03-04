import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { BookResolver } from './resolvers/book.resolver';

@Module({
  controllers: [],
  providers: [ServicesService, BookResolver],
})
export class BookModule {}
