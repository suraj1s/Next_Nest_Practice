import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserResolver } from './graphql/resolver/UserResolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './graphql/models/User';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/graphql/schema.gql',
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
      entities: [User],
      subscribers: [],
      migrations: [],
    }),
  ],
  controllers: [],
  providers: [UserResolver],
})
export class AppModule {}
