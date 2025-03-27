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

const CREATE_POST = gql`
  mutation createPost(
    $title: String!
    $content: String!
    $description: String!
    $publishedAt: String
    $image: Upload
  ) {
    createPost(
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
      authorId
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

const GET_POSTS = gql`
  query listPosts(
    $limit: Int = 10
    $offset: Int = 0
    $onlyMine: Boolean
    $excludeMine: Boolean
    $sort: String
  ) {
    listPosts(
      limit: $limit
      offset: $offset
      onlyMine: $onlyMine
      excludeMine: $excludeMine
      sort: $sort
    ) {
      id
      title
      description
      content
      image
      authorId
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

const SEARCH_POSTS = gql`
  query searchPosts($query: String!) {
    searchPosts(query: $query) {
      id
      title
      content
      authorId
      image
      publishedAt
      description
      createdAt
      updatedAt
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
    publishedAt?: string,
    image?: File
  ): Promise<PostResponse> {
    try {
      const imageFile = image || null;
      const variables: {
        id: string;
        title: string;
        content: string;
        description: string;
        publishedAt?: string;
        image: File | null;
      } = {
        id,
        title,
        content,
        description,
        image: imageFile,
      };

      if (publishedAt) {
        variables.publishedAt = publishedAt;
      }
      const { data } = await apolloClient.mutate<{ updatePost: PostResponse }>({
        mutation: UPDATE_POST,
        variables,
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
  async createPost(
    title: string,
    content: string,
    description: string,
    publishedAt?: string,
    image?: File
  ): Promise<PostResponse> {
    try {
      const imageFile = image || null;
      const variables: {
        title: string;
        content: string;
        description: string;
        publishedAt?: string;
        image: File | null;
      } = {
        title,
        content,
        description,
        image: imageFile,
      };

      if (publishedAt) {
        variables.publishedAt = publishedAt;
      }
      const { data } = await apolloClient.mutate<{ createPost: PostResponse }>({
        mutation: CREATE_POST,
        variables,
      });
      if (!data || !data.createPost) {
        throw new Error("Error creating post, no data received.");
      }
      return data.createPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
  async getPosts(
    limit?: number,
    offset?: number,
    onlyMine?: boolean,
    excludeMine?: boolean,
    sort: "new" | "old" = "new"
  ): Promise<PostResponse[]> {
    try {
      const { data } = await apolloClient.query<{ listPosts: PostResponse[] }>({
        query: GET_POSTS,
        variables: { limit, offset, onlyMine, excludeMine, sort },
        fetchPolicy: "network-only",
      });
      if (!data || !data.listPosts) {
        throw new Error("Failed to fetch posts.");
      }
      return data.listPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },
  async searchPosts(query: string): Promise<PostResponse[]> {
    try {
      const { data } = await apolloClient.query<{
        searchPosts: PostResponse[];
      }>({
        query: SEARCH_POSTS,
        variables: { query },
      });
      if (!data || !data.searchPosts) {
        throw new Error("Failed to fetching posts for query");
      }
      return data.searchPosts;
    } catch (error) {
      console.error(`Error fetching posts for query "${query}":`, error);
      throw error;
    }
  },
};
