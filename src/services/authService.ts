import type { LoginResponse } from "@customTypes/authTypes";
import { gql } from "@apollo/client";
import { apolloClient } from "@graphql/index";

const logInMutation = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
        phone
        birthday
        gender
        firstName
        lastName
        role
        posts {
          id
          title
          content
        }
        createdAt
        updatedAt
      }
      token
    }
  }
`;

export const authService = {
  async login(username: string, password: string) {
    return apolloClient.mutate<LoginResponse>({
      mutation: logInMutation,
      variables: { username, password },
    });
  },
};
