import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import tabReducer from "./slices/tableSlice";
import usersReducer from "./slices/usersSlice";
import postsReducer from "./slices/postsSlice";
import paginationReducer from "./slices/pagiNationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tab: tabReducer,
    users: usersReducer,
    posts: postsReducer,
    pagination: paginationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
