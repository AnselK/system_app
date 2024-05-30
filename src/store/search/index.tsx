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
  current: undefined,
};

const getHistoryAction = () => {};

export const searchSlice = createSlice({
  name: "main_data",
  initialState,
  reducers: {
    createSearch(state, action: PayloadAction<SearchsItemType>) {
      const { isHistory, search, search_params } = action.payload;
      const id = createId();
      const sear: SearchsItemType = {
        id,
        search,
        isHistory,
        search_params,
        loading: true,
      };
      state.current = sear;
      state.history.push({ ...sear });
    },
    changeSearch(state, action) {
      const history = [...state.history];

      if (!action.payload) {
        state.current = undefined;
      } else {
        state.current = history.find((item) => item.id === action.payload);
      }
    },
    initSearchs(state, action) {
      state.history = action.payload.map((item) => ({
        ...item,
        isHistory: true,
        loading: false,
      }));
    },
    addHistoryData(state, action) {
      const h = state.history.find((item) => []);
    },
    deleteSearchHis(state, action) {
      state.history = state.history.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { createSearch, initSearchs, changeSearch, deleteSearchHis } =
  searchSlice.actions;
export default searchSlice.reducer;
