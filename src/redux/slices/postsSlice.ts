import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id: string;
  title: string;
  content: string;
  description: string;
  image?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface PostsState {
  posts: Post[];
  draftPosts: Post[];
  currentPost: Post | null;
  loading: boolean;
  isDraftsView: boolean;
}

const initialState: PostsState = {
  posts: [],
  draftPosts: [],
  currentPost: null,
  loading: false,
  isDraftsView: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload.filter((post) => post.publishedAt !== null);
      state.draftPosts = action.payload.filter(
        (post) => post.publishedAt === null
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      state.draftPosts = state.draftPosts.filter(
        (post) => post.id !== action.payload
      );
    },
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
    },
    toggleDraftsView: (state) => {
      state.isDraftsView = !state.isDraftsView;
    },
  },
});

export const {
  setPosts,
  setLoading,
  removePost,
  setCurrentPost,
  toggleDraftsView,
} = postsSlice.actions;
export default postsSlice.reducer;
