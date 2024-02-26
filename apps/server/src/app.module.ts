import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/TypeOrm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // host: "localhost",
      // port: 5432,
      // username: "test",
      // password: "test",
      database: 'chat_project.db',
      synchronize: true, // This will create the database if it doesn't exist and detect changes and sync with db
      logging: true,
      entities: [],
      subscribers: [],
      migrations: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
