import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { createId } from "@src/common/constUtils";
import { SearchsItemType } from "./interface";
import to from "@src/common/requestUtils/to";
import { getHistorySearch, queryData } from "@src/services/data";
import { cancelToken } from "@src/common/requestUtils/cancel";
import { CommentsApi } from "@src/pages/DataPage/type";
import { useNavigate } from "react-router-dom";
type SearchState = {
  history: Array<SearchsItemType>;
  current?: SearchsItemType;
  loading?: boolean;
  currentData?: [];
  hasSearch: boolean;
  current_id?: string;
  hasCrawer: boolean;
};
const initialState: SearchState = {
  history: [],
  current: undefined,
  hasSearch: false,
  current_id: undefined,
  hasCrawer: false,
};
const timeout = setTimeout || setImmediate;
export const getHistoryAsyncAction = () => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(addHistoryData({}));
    });
  };
};
type videoData = {
  id: string | number;
  data: any;
  loading: boolean;
};
const tokenMap = new Map();
// 定义异步action
export const fetchData = createAsyncThunk(
  "main_data/fetchData",
  async (params: any, { dispatch }) => {
    dispatch(toogleCrawer({ id: params.id, status: true }));
    let reqToken;
    if (tokenMap.has(params.id)) {
      reqToken = tokenMap.get(params.id).token;
    } else {
      const { token, cancel } = cancelToken();
      reqToken = token;
      tokenMap.set(params.id, { token, cancel, timer: null });
    }
    const response: any = await queryData(params, reqToken);
    let video: videoData = { id: params.id, data: [], loading: false };
    switch (response.code) {
      case 0:
        const { data, all_finish } = response;
        const { comments_info, video_info }: CommentsApi = data;
        if (video_info) {
          const videoData = {
            ...video_info,
            list: comments_info ?? [],
          };

          video = { ...video, data: videoData, loading: all_finish !== 1 };
        }

        if (all_finish === 1) {
          dispatch(toogleCrawer({ id: params.id, status: false }));
          break;
        }
        if (all_finish === 0) {
          tokenMap.get(params.id).timer = timeout(() => {
            dispatch(fetchData(params));
          }, 2000);
        }

        break;
      case 3:
        useNavigate()("/login");
        dispatch(pauseSearch(params.id));
        break;
      default:
        break;
    }
    return video;
  }
);

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
      state.current_id = id;
      state.history.push(state.current);
    },
    changeSearch(state, action) {
      const history = [...state.history];
      if (!action.payload) {
        state.current = undefined;
      } else {
        state.current = history.find((item) => item.id + "" === action.payload);
      }
      state.current_id = action.payload;
    },
    toogleCrawer(state, action) {
      state.hasCrawer = action.payload.status;
      const target = state.history.find(
        (item) => item.id === action.payload.id
      );
      if (target) {
        target.crawered = !action.payload.status;
        if (state.current?.id === action.payload.id) {
          state.current = target;
        }
      }
    },
    initSearchs(state, action) {
      state.history = action.payload.map((item) => ({
        ...item,
        isHistory: true,
        loading: false,
        crawered:true
      }));
    },
    addHistoryData(state, action) {
      const h = state.history.find(
        (item) => item.id + "" === action.payload.id + ""
      );
      if (h) {
        h.list = action.payload.data;
        h.loading = false;
      }
      if (state.current && state.current?.id === action.payload.id) {
        state.current = h;
      }
    },
    deleteSearchHis(state, action) {
      state.history = state.history.filter(
        (item) => item.id !== action.payload
      );
      if (state.current && state.current?.id === action.payload.id) {
        state.current = undefined;
      }
    },
    pauseSearch(state, action) {
      const h = state.history.find((item) => item.id === action.payload);
      if (!h?.loading) return;
      if (h) {
        h.loading = false;
      }
      if (state.current && action.payload === state.current?.id) {
        state.current = h;
      }
      if (tokenMap.has(action.payload)) {
        const target = tokenMap.get(action.payload);
        target.cancel?.();
        clearTimeout(target.timer);
      }
      state.hasCrawer = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const h = state.history.find((item) => item.id === action.payload?.id);
      if (h) {
        const v = h.list?.find((vi) => vi.video_id === action.payload?.id);
        if (v) {
          v.list
            ? v.list.push(...action.payload?.data.list)
            : (v.list = action.payload?.data.list);
        } else {
          h.list
            ? h.list.push(action.payload?.data)
            : (h.list = [action.payload?.data]);
        }
        h.loading = action.payload?.loading;
      }
      if (state.current && state.current.id === action.payload?.id) {
        state.current = h;
      }
    });
  },
});

export const {
  createSearch,
  initSearchs,
  changeSearch,
  deleteSearchHis,
  addHistoryData,
  pauseSearch,
  toogleCrawer,
} = searchSlice.actions;
export default searchSlice.reducer;
