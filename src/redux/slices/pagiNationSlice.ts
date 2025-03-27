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

interface PaginationState {
  myPosts: Post[];
  limitMyPost: number;
  pageMyPost: number;
  sortMyPosts: "new" | "old";
  onlyMine: boolean;
  loadingMyPosts: boolean;

  otherPosts: Post[];
  limitNotMyPost: number;
  pageNotMyPost: number;
  sortNotMyPosts: "new" | "old";
  excludeMine: boolean;
  loadingOtherPosts: boolean;
}

const initialState: PaginationState = {
  myPosts: [],
  limitMyPost: 10,
  pageMyPost: 1,
  sortMyPosts: "new",
  onlyMine: true,
  loadingMyPosts: false,

  otherPosts: [],
  limitNotMyPost: 4,
  pageNotMyPost: 1,
  sortNotMyPosts: "new",
  excludeMine: false,
  loadingOtherPosts: false,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPaginationMyPosts: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        sort: "new" | "old";
      }>
    ) => {
      state.pageMyPost = action.payload.page;
      state.limitMyPost = action.payload.limit;
      state.sortMyPosts = action.payload.sort;
    },
    setPaginationNotMyPosts: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        sort: "new" | "old";
      }>
    ) => {
      state.pageNotMyPost = action.payload.page;
      state.limitNotMyPost = action.payload.limit;
      state.sortNotMyPosts = action.payload.sort;
    },
    updateSortPosts: (state, action: PayloadAction<"new" | "old">) => {
      if (state.onlyMine && !state.excludeMine) {
        state.sortMyPosts = action.payload;
      } else if (!state.onlyMine && state.excludeMine) {
        state.sortNotMyPosts = action.payload;
      }
    },
    toggleOnlyMine: (state) => {
      state.onlyMine = !state.onlyMine;
      state.excludeMine = !state.excludeMine;
    },
    setLimitPosts: (state, action: PayloadAction<Post[]>) => {
      if (state.onlyMine && !state.excludeMine) {
        state.myPosts = action.payload;
      } else if (!state.onlyMine && state.excludeMine) {
        state.otherPosts = action.payload;
      }
    },

    setLimitLoading: (state, action: PayloadAction<boolean>) => {
      if (state.onlyMine && !state.excludeMine) {
        state.loadingMyPosts = action.payload;
      } else if (!state.onlyMine && state.excludeMine) {
        state.loadingOtherPosts = action.payload;
      }
    },
  },
});

export const {
  setPaginationMyPosts,
  setPaginationNotMyPosts,
  updateSortPosts,
  toggleOnlyMine,
  setLimitPosts,
  setLimitLoading,
} = paginationSlice.actions;

export default paginationSlice.reducer;
