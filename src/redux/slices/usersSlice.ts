import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id: string;
  title: string;
  content: string;
}

interface User {
  id: string;
  username: string;
  phone: string;
  birthday: string;
  gender: string;
  firstName: string;
  lastName: string;
  role?: string;
  posts: Post[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUsers, setLoading } = usersSlice.actions;
export default usersSlice.reducer;
