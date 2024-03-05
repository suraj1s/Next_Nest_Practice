import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { UserResolver } from './graphql/resolver/UserResolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/models/User';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { Book } from './book/graphql/book.schema';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      //  this is for code first approach
      autoSchemaFile: 'src/graphql/schema.gql', // this will create a schema file in the project and load it

      // this is for schema first approach
      // typePaths: ['./**/*.graphql'], // this will load all .graphql files in the project and merge them into one schema
      playground: true,
      // this is used to auto generate the typescript types for the schema
      definitions: {
        path: 'src/graphql/types.ts',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // host: "localhost",
      // port: 5432,
      // username: "test",
      // password: "test",
      database: 'chat_project.db',
      synchronize: true, // This will create the database if it doesn't exist and detect changes and sync with db
      logging: false,
      entities: [User, Book],
      subscribers: [],
      migrations: [],
    }),
    BookModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
