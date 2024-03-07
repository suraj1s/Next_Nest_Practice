
import AllTodo from "@/component/AllTodo";
export default function Home() {
    return (
        <main className="container p-20 ">
          <h1>GraphQL</h1>
          <div>
            <AllTodo />
          </div>
        </main>
    );
  }


// "use client"
// import AllTodo from "@/component/AllTodo";
// import {
//   ApolloClient,
//   ApolloProvider,
//   HttpLink,
//   InMemoryCache,
//   from,
// } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   // if(graphQLErrors) {
//   // graphQLErrors.map({ message, location, path }) => {
//   //   console.log(`message` , message)
//   //   return null
//   // }
//   // }
//   console.log(
//     "graphql errors : ",
//     graphQLErrors,
//     "network Error : ",
//     networkError
//   );
// });
// const link = from([
//   errorLink,
//   new HttpLink({ uri: "http://localhost:8000/graphql" }),
// ]);
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: link,
// });
// export default function Home() {
//   return (
//     <ApolloProvider client={client}>
//       <main className="container p-20">
//         <h1>GraphQL</h1>
//         <div>
//           <AllTodo />
//         </div>
//       </main>
//     </ApolloProvider>
//   );
// }
