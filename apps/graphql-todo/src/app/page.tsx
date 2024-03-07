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

const REFRESH_TOKEN_MUTATION = gql`
  mutation {
    refreshTokens(
      userId: 1
      refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoicmFtQGdtYWlsLmNvbSIsImlhdCI6MTcwOTgwOTM4MCwiZXhwIjoxNzA5ODA5NTAwfQ.4NRptmQyAtRPtgmgQe0hS3hM2AYj_nKssrhuQMxM7I8"
    ) {
      accessToken
    }
  }
`;
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoicmFtQGdtYWlsLmNvbSIsImlhdCI6MTcwOTgwOTUwOCwiZXhwIjoxNzA5ODA5NTM4fQ.Jyqy6VC1fyIkJAlN2u4vKch1yC_bwP7VRgOXuKp-pq8";

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
const errorLink = onError(({ graphQLErrors, networkError, operation , forward }) => {
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
    // const newAccessToken = getNewAuthUsingRefreshMutation(client)
    //   .then((newAccessToken) => {
    //     console.log(newAccessToken, "newAccessToken");
    //     // Update the authorization header with the new token
    //     authLink.setContext((existingHeaders) => ({
    //       ...existingHeaders,
    //       authorization: newAccessToken ? `Bearer ${newAccessToken}` : "",
    //     }));
    //     // Retry the operation 
    //     const subscriber = {
    //       next: observer.next.bind(observer),
    //       error: observer.error.bind(observer),
    //       complete: observer.complete.bind(observer)
    //     };

    //     // Retry last failed request
    //     forward(operation).subscribe(subscriber);
         
    //   })
    //   .catch(
    //     (error) =>
    //       console.error("Failed to refresh token and retry request:", error)
    //     // Handle the error appropriately, e.g., redirect to login page
    //   );
    return new Observable( observer => {
      getNewAuthUsingRefreshMutation(client)
        .then(refreshResponse => {
          operation.setContext(({ headers = {} }) => ({
            headers: {
              // Re-add old headers
              ...headers,
              // Switch out old access token for new one
              token: refreshResponse?.token ?? null,
            }
          }));
        })
        .then(() => {
          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          }

          // Retry last failed request
          forward(operation).subscribe(subscriber);
        })
        .catch(error => {
          // No refresh or client token available, we force user to login
          console.error("Error during token refresh and retry:", error);
          observer.error(error);
        });
    });
  }
});

const authLink = setContext((request, { headers }) => {
  // Include the initial authorization header with the refresh token
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
