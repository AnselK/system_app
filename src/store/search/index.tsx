import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@src/common/constUtils";
type SearchState = {
  current_search_info: string;
  current_data_id: string;
  current_data: Array<any>;
  history: Array<any>;
};
const initialState: SearchState = {
  current_search_info: "",
  current_data_id: "",
  current_data: [],
  history: [],
};

export const searchSlice = createSlice({
  name: "main_data",
  initialState,
  reducers: {
    createSearch(state, action: PayloadAction<string>) {
      const id = createId();
      state.current_search_info = action.payload;
      state.history = [
        { id, info: state.current_search_info },
        ...state.history,
      ];
    },
  },
});

export const { createSearch } = searchSlice.actions;
export default searchSlice.reducer;
