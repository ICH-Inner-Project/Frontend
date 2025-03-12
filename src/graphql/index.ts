import {
  ApolloClient,
  // createHttpLink,
  InMemoryCache,
  ApolloLink,
  Operation,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// const httpLink = createHttpLink({
//   uri: "http://localhost:3333/graphql",
// });

const authLink: ApolloLink = new ApolloLink((operation: Operation, forward) => {
  const token = localStorage.getItem("token");

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

const uploadLink = createUploadLink({
  uri: "http://localhost:3333/graphql",
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache: new InMemoryCache(),
});
