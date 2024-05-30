import { createSlice, current } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@src/common/constUtils";
import { SearchsItemType } from "./interface";
import to from "@src/common/requestUtils/to";
import { getHistorySearch } from "@src/services/data";
type SearchState = {
  history: Array<SearchsItemType>;
  current?: SearchsItemType;
  loading?: boolean;
  currentData?: [];
  hasSearch: boolean;
};
const initialState: SearchState = {
  history: [],
  current: undefined,
  hasSearch: false,
};

export const getHistoryAsyncAction = () => {
  return (dispatch: Dispatch) => {
    dispatch(addHistoryData({}));
  };
};

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
      state.history.push(state.current);
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
      const setData = (c) => {
        const v = c.list?.find(
          (vi) => vi.video_id === action.payload.data.video_id
        );
        if (v) {
          v.list = [...v.list, action.payload.data.list];
        } else {
          c.list?.push(action.payload.data);
        }
        c.loading = action.payload.loading;
      };
      if (state.current && state.current.id === action.payload.id) {
        setData(state.current);
        return;
      }
      const h = state.history.find((item) => item.id === action.payload.id);
      if (h) {
        setData(h);
      }
    },
    deleteSearchHis(state, action) {
      state.history = state.history.filter(
        (item) => item.id !== action.payload
      );
    },
    changeLoaded(state, action) {
      if (state.current) state.current.loading = action.payload;
    },
    pauseSearch(state, action) {
      if (state.current && action.payload === state.current?.id) {
        state.current.loading = false;
      } else {
        const h = state.history.find((item) => item.id === action.payload);
        if (h) {
          h.loading = false;
        }
      }
    },
  },
});

export const {
  createSearch,
  initSearchs,
  changeSearch,
  deleteSearchHis,
  addHistoryData,
  pauseSearch,
} = searchSlice.actions;
export default searchSlice.reducer;
