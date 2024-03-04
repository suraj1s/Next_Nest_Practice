import { Module } from '@nestjs/common';
import { ControllersController } from './controllers/controllers.controller';
import { ServicesService } from './services/services.service';
import { BookResolver } from './resolvers/book.resolver';

@Module({
  controllers: [ControllersController],
  providers: [ServicesService, BookResolver],
})
export class BookModule {}
