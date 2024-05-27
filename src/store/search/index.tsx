import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@src/common/constUtils";
import { SearchsItemType } from "./interface";
import to from "@src/common/requestUtils/to";
import { getHistorySearch } from "@src/services/data";
type SearchState = {
  history: Array<SearchsItemType>;
  current?: SearchsItemType;
  loading?: boolean;
  currentData?: [];
};
const initialState: SearchState = {
  history: [],
};

const getHistoryAction = () => {};

export const searchSlice = createSlice({
  name: "main_data",
  initialState,
  reducers: {
    createSearch(state, action: PayloadAction<SearchsItemType>) {
      const { isHistory, key_word, search_params } = action.payload;
      const id = createId();
      const sear: SearchsItemType = {
        current_id: id,
        key_word,
        isHistory,
        search_params,
      };
      state.current = sear;
      state.history = [sear, ...state.history];
    },
    changeSearch(state, action) {
      if (action.payload) {
        state.current = undefined;
      } else {
        state.current = state.history.find(
          (item) => item.current_id === action.payload
        );
      }
    },
    initSearchs(state, action) {
      state.history.push(action.payload);
    },
    addHistoryData(state, action) {
      const h = state.history.find((item) => []);
    },
    deleteSearchHis(state, action) {
      state.history = state.history.filter(
        (item) => item.current_id !== action.payload
      );
    },
  },
  extraReducers(builder) {},
});

export const { createSearch, initSearchs, changeSearch, deleteSearchHis } = searchSlice.actions;
export default searchSlice.reducer;
