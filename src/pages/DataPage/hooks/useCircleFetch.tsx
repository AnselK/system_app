import { cancelToken } from "@src/common/requestUtils/cancel";
import { queryData, queryHistoryData } from "@src/services/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommentsApi, Video } from "../type";
import Cache from "../_cache/classes";
import { debounce } from "@src/common/functionUtils";
import { SearchsItemType } from "@src/store/search/interface";
import to from "@src/common/requestUtils/to";
import { useDispatch } from "react-redux";
import { addHistoryData, pauseSearch, fetchData } from "@src/store/search";
import { useSelector } from "react-redux";
import { messageError } from "@src/common/messageUtil";
const cacheReq = new Map();

const _chahe = Cache();
function useCircleFetch<T>() {
  const dispatch = useDispatch();
  const current = useSelector((state: any) => state.main_data.curreent);
  const hasCrawer = useSelector((state: any) => state.main_data.hasCrawer);
  const historyQuery = async (current, params) => {
    const [data, error] = await to<any[], any>(queryHistoryData, {
      id: current.id,
    });
    const list = data.map(({ comments_info, video_info }) => {
      return {
        ...video_info,
        list: comments_info,
      };
    });
    if (!error) {
      _chahe.set(current.id, 1);
      dispatch(addHistoryData({ id: current.id, data: list, loading: false }));
    }
  };

  const start = debounce((currentItem: SearchsItemType) => {
    if (hasCrawer) {
      messageError("请等待搜索完毕或停止搜索后再进行操作");
      return;
    }
    if (!currentItem) return;

    if (_chahe.has(currentItem)) {
      const chc = _chahe.get(currentItem);
      return chc;
    }
    const data = {
      id: currentItem.id,
      search_info: currentItem.search,
      ...currentItem.search_params,
    };
    if (currentItem.crawered) {
      historyQuery(currentItem, data);
      return;
    }
    _chahe.set(currentItem.id, 1);
    // @ts-ignore
    dispatch(fetchData(data));
    // request(currentItem, data);
  }, 64);

  const pause = () => {
    if (current.crawered) {
      return;
    }
    dispatch(pauseSearch(current.id));
  };

  return [start, pause] as [typeof start, typeof pause];
}

export default useCircleFetch;
