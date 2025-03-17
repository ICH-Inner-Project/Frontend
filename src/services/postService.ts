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

const UPDATE_POST = gql`
  mutation updatePost(
    $id: ID!
    $title: String
    $content: String
    $description: String
    $publishedAt: String
    $image: Upload
  ) {
    updatePost(
      id: $id
      title: $title
      content: $content
      description: $description
      publishedAt: $publishedAt
      image: $image
    ) {
      id
      title
      content
      description
      image
      publishedAt
    }
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
  async updatePost(
    id: string,
    title: string,
    content: string,
    description: string,
    publishedAt: string,
    image?: File
  ): Promise<PostResponse> {
    try {
      const imageFile = image || null;
      const { data } = await apolloClient.mutate<{ updatePost: PostResponse }>({
        mutation: UPDATE_POST,
        variables: {
          id,
          title,
          content,
          description,
          publishedAt,
          image: imageFile,
        },
      });

      if (!data || !data.updatePost) {
        throw new Error("Error updating post, no data received.");
      }
      return data.updatePost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },
};
