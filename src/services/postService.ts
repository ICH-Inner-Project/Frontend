import { gql } from "@apollo/client";
import { apolloClient } from "@graphql/index";
import { PostResponse } from "@customTypes/postTypes";

const GET_USER_POSTS = gql`
  query getUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
      id
      title
      content
      description
      image
      authorId
      createdAt
      updatedAt
      publishedAt
    }
  }
`;
const GET_POST = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      content
      image
      authorId
      publishedAt
      description
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const postService = {
  async getUserPosts(userId: string): Promise<PostResponse[]> {
    const { data } = await apolloClient.query<{ userPosts: PostResponse[] }>({
      query: GET_USER_POSTS,
      variables: { userId },
      fetchPolicy: "network-only",
    });
    console.log(data);
    if (!data || !data.userPosts) {
      throw new Error("Failed to fetch posts.");
    }

    return data.userPosts;
  },
  async getPost(id: string): Promise<PostResponse> {
    const { data } = await apolloClient.query<{ getPost: PostResponse }>({
      query: GET_POST,
      variables: { id },
    });
    console.log(data);
    if (!data || !data.getPost) {
      throw new Error("Failed to fetch post.");
    }
    return data.getPost;
  },
  async deletePost(id: string): Promise<boolean> {
    try {
      const { data } = await apolloClient.mutate<{ deletePost: boolean }>({
        mutation: DELETE_POST,
        variables: { id },
      });
      if (!data || !data.deletePost) {
        console.error("Error: Failed to delete post. No response received.");
        return false;
      }
      return data.deletePost;
    } catch (error) {
      console.error("Error while deleting post:", error);
      return false;
    }
  },
};
