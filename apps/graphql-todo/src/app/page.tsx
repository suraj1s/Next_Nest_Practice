"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  FetchResult,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { Observable, from } from "apollo-link"; // Import for chaining links
import AllTodoApollo from "@/component/AllTodoApollo";
import { REFRESH_TOKEN_MUTATION } from "@/graphql/Mutations";
import { GraphQLError } from "graphql";

const getNewAuthUsingRefreshMutation = async (
  client: ApolloClient<any>,
  userId: number,
  refreshToken: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { userId, refreshToken },
    });
    localStorage.setItem("accessToken", data.refreshTokens.accessToken);
    return data.refreshTokens.accessToken;
  } catch (error) {
    console.error("Failed to refresh auth token:", error);
  }
};
const errorLink = onError(
  //@ts-ignore
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) console.error(`[Network error]: ${networkError}`);
    if (
      graphQLErrors &&
      graphQLErrors.some((error) => error.extensions.code === "UNAUTHENTICATED")
    ) {
      return new Observable<FetchResult<Record<string, any>>>((observer) => {
        // used an annonymous function for using an async function
        // (async () => {
        //   try {
        const userId = 1;
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new GraphQLError("No Refresh Token");
        }
        // const accessToken = 
        getNewAuthUsingRefreshMutation(
          client,
          userId,
          refreshToken
        )
          .then((accessToken) => {
            if (!accessToken) {
              throw new GraphQLError("Empty AccessToken");
            }
            // Retry the failed request
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };
            forward(operation).subscribe(subscriber);
          })
          .catch((error) => {
            observer.error(error);
          });

        //   } catch (err) {
        //     observer.error(err);
        //   }
        // })();
      });
    }
  }
);

const authLink = setContext((request, { headers }) => {
  // Include the initial authorization header with the refresh token
  const accessToken = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, authLink, httpLink]),
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <main className="container p-20">
        <div>
          <AllTodoApollo />
        </div>
      </main>
    </ApolloProvider>
  );
}