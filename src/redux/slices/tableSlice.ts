import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TabState = "list" | "create";

interface TableSliceState {
  selectedTab: TabState;
}

const initialState: TableSliceState = {
  selectedTab: "list",
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setSelectedTab(state, action: PayloadAction<TabState>) {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = tabSlice.actions;
export default tabSlice.reducer;
