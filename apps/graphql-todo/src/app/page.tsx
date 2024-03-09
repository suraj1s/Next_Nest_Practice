"use client";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
  ApolloProvider,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { Observable, from } from "apollo-link"; // Import for chaining links
import AllTodoApollo from "@/component/AllTodoApollo";


const refreshToken = localStorage.getItem("refreshToken");
const REFRESH_TOKEN_MUTATION = gql`
  mutation {
    refreshTokens(
      userId: 1
      refresh_token:${refreshToken}
    ) {
      accessToken
    }
  }
`;

const getNewAuthUsingRefreshMutation = async (client: ApolloClient<any>) => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
    });
    return data.refreshTokens.accessToken;
  } catch (error) {
    console.error("Failed to refresh auth token:", error);
    // Handle the error appropriately, e.g., redirect to login page
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
    // Check for specific GraphQL errors indicating expired token:
    if (
      graphQLErrors &&
      graphQLErrors.some((error) => error.extensions.code === "UNAUTHENTICATED")
    ) {
      return new Observable((observer) => {
        (async () => {
          getNewAuthUsingRefreshMutation(client)
            .then((refreshResponse) => {
              console.log("new token ", refreshResponse);
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  token: refreshResponse?.token ?? null,
                },
              }));
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            })
            .catch((error) => {
              console.error("Error during token refresh and retry:", error);
              observer.error(error);
            });
        })();
      });
    }
  }
);

const authLink = setContext((request, { headers }) => {
  // Include the initial authorization header with the refresh token
  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken, "access token called from set context");
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

const link = from([errorLink, authLink, httpLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
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
// "use client";
// import AllTodoApollo from "@/component/AllTodoApollo";
// import {
//   ApolloClient,
//   ApolloProvider,
//   HttpLink,
//   InMemoryCache,
//   from,
// } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
//     );
//   }
//   if (networkError) console.error(`[Network error]: ${networkError}`);
// });

// const httpLink = new HttpLink({
//   uri: 'http://localhost:8000/graphql',
//   // Add the authorization header here:
//   headers: {
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoicmFtQGdtYWlsLmNvbSIsImlhdCI6MTcwOTcxNjk2MSwiZXhwIjoxNzEwMTQ4OTYxfQ.kOk2l3OFmhnzvKuPl9ZHZJexNt17Rw8Lyes3y9Ofmag',
//   },
// });

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: errorLink.concat(httpLink),
// });
// export default function Home() {
//   return (
//     <ApolloProvider client={client}>
//       <main className="container p-20">
//         <div>
//           <AllTodoApollo />
//         </div>
//       </main>
//     </ApolloProvider>
//   );
// }

// import AllTodoRtk from "@/component/AllTodoRtk";
// export default function Home() {
//     return (
//         <main className="container p-20 ">
//           <h1>GraphQL</h1>
//           <div>
//             <AllTodoRtk />
//           </div>
//         </main>
//     );
//   }

// function isRefreshRequest(operation: GraphQLRequest) {
//   return operation.operationName === 'refreshToken';
// }

// // Returns accesstoken if opoeration is not a refresh token request
// function returnTokenDependingOnOperation(operation: GraphQLRequest) {
//   if (isRefreshRequest(operation))
//     return localStorage.getItem('refreshToken') || '';
//   else return localStorage.getItem('accessToken') || '';
// }

// const httpLink = createHttpLink({
//   uri: 'http://localhost:3000/graphql',
// });

// const authLink = setContext((operation, { headers }) => {
//   let token = returnTokenDependingOnOperation(operation);

//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const errorLink = onError(
//   ({ graphQLErrors, networkError, operation, forward }) => {
//     if (graphQLErrors) {
//       for (let err of graphQLErrors) {
//         switch (err.extensions.code) {
//           case 'UNAUTHENTICATED':
//             // ignore 401 error for a refresh request
//             if (operation.operationName === 'refreshToken') return;

//             const observable = new Observable<FetchResult<Record<string, any>>>(
//               (observer) => {
//                 // used an annonymous function for using an async function
//                 (async () => {
//                   try {
//                     const accessToken = await refreshToken();

//                     if (!accessToken) {
//                       throw new GraphQLError('Empty AccessToken');
//                     }

//                     // Retry the failed request
//                     const subscriber = {
//                       next: observer.next.bind(observer),
//                       error: observer.error.bind(observer),
//                       complete: observer.complete.bind(observer),
//                     };

//                     forward(operation).subscribe(subscriber);
//                   } catch (err) {
//                     observer.error(err);
//                   }
//                 })();
//               }
//             );

//             return observable;
//         }
//       }
//     }

//     if (networkError) console.log(`[Network error]: ${networkError}`);
//   }
// );

// const client = new ApolloClient({
//   link: ApolloLink.from([errorLink, authLink, httpLink]),
//   cache: new InMemoryCache(),
// });

// // Request a refresh token to then stores and returns the accessToken.
// const refreshToken = async () => {
//   try {
//     const refreshResolverResponse = await client.mutate<{
//       refreshToken: AccessToken;
//     }>({
//       mutation: REFRESH_TOKEN,
//     });

//     const accessToken = refreshResolverResponse.data?.refreshToken.accessToken;
//     localStorage.setItem('accessToken', accessToken || '');
//     return accessToken;
//   } catch (err) {
//     localStorage.clear();
//     throw err;
//   }
// };
