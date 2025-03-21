import { gql } from "@apollo/client";
import { apolloClient } from "@graphql/index";
import { UsersQueryResponse, UserResponse } from "@customTypes/userTypes";

const GET_USERS = gql`
  query getUsers {
    users {
      id
      username
      phone
      birthday
      gender
      firstName
      lastName
      role
      avatar
      createdAt
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $username: String
    $phone: String
    $birthday: String
    $gender: String
    $role: String
    $firstName: String
    $lastName: String
    $avatar: Upload
  ) {
    updateUser(
      id: $id
      username: $username
      phone: $phone
      birthday: $birthday
      gender: $gender
      role: $role
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
    ) {
      id
      username
      phone
      birthday
      gender
      role
      firstName
      lastName
      avatar
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      username
      phone
      birthday
      gender
      firstName
      lastName
      role
      avatar
      createdAt
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $password: String!
    $phone: String!
    $birthday: String!
    $gender: String!
    $firstName: String!
    $lastName: String!
    $role: String
    $avatar: Upload
  ) {
    createUser(
      username: $username
      password: $password
      phone: $phone
      birthday: $birthday
      gender: $gender
      firstName: $firstName
      lastName: $lastName
      role: $role
      avatar: $avatar
    ) {
      id
      username
      phone
      birthday
      gender
      firstName
      lastName
      role
      avatar
    }
  }
`;

export const GET_USER = gql`
  query getUser {
    me {
      id
      username
      phone
      birthday
      gender
      firstName
      lastName
      role
      avatar
      posts
      createdAt
      updatedAt
    }
  }
`;

export const usersService = {
  async getUsers(): Promise<UserResponse[]> {
    const { data } = await apolloClient.query<UsersQueryResponse>({
      query: GET_USERS,
      fetchPolicy: "network-only",
    });
    console.log(data);
    if (!data || !data.users) {
      throw new Error("Failed to fetch users.");
    }
    return data.users;
  },
  async deleteUser(id: string): Promise<boolean> {
    try {
      const { data } = await apolloClient.mutate<{ deleteUser: boolean }>({
        mutation: DELETE_USER,
        variables: { id },
      });

      if (!data || data.deleteUser === undefined) {
        console.error("Error: Failed to delete user. No response received.");
        return false;
      }
      return data.deleteUser;
    } catch (error) {
      console.error("Error while deleting user:", error);
      return false;
    }
  },
  async updateUser(
    id: string,
    username: string,
    phone: string,
    birthday: string,
    gender: string,
    firstName: string,
    lastName: string,
    role?: string,
    avatar?: File
  ): Promise<UserResponse> {
    try {
      const avatarFile = avatar || null;
      const { data } = await apolloClient.mutate<{ updateUser: UserResponse }>({
        mutation: UPDATE_USER,
        variables: {
          id,
          username,
          phone,
          birthday,
          gender,
          role: role || "user",
          lastName,
          firstName,
          avatar: avatarFile,
        },
      });

      if (!data || !data.updateUser) {
        throw new Error("Error updating user, no data received.");
      }
      return data.updateUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  async getUserById(id: string): Promise<UserResponse> {
    const { data } = await apolloClient.query<{ user: UserResponse }>({
      query: GET_USER_BY_ID,
      variables: { id },
    });
    if (!data || !data.user) {
      throw new Error(`User with id ${id} not found`);
    }
    return data.user;
  },
  async createUser(
    username: string,
    password: string,
    phone: string,
    birthday: string,
    gender: string,
    firstName: string,
    lastName: string,
    role?: string,
    avatar?: File
  ): Promise<UserResponse> {
    try {
      const avatarFile = avatar || null;
      const { data } = await apolloClient.mutate<{ createUser: UserResponse }>({
        mutation: CREATE_USER,
        variables: {
          username,
          password,
          phone,
          birthday,
          gender,
          role: role || "user",
          lastName,
          firstName,
          avatar: avatarFile,
        },
      });
      if (!data || !data.createUser) {
        throw new Error("Error creating user, no data received.");
      }
      return data.createUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  async getUser(): Promise<UserResponse> {
    const { data } = await apolloClient.query<{ me: UserResponse }>({
      query: GET_USER,
    });
    if (!data || !data.me) {
      throw new Error("Failed to fetch user.");
    }
    return data.me;
  },
};
