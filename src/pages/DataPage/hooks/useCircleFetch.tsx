import { cancelToken } from "@src/common/requestUtils/cancel";
import { queryData, queryHistoryData } from "@src/services/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommentsApi, Video } from "../type";
import Cache from "../_cache/classes";
import { debounce } from "@src/common/functionUtils";
import { SearchsItemType } from "@src/store/search/interface";
import to from "@src/common/requestUtils/to";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addHistoryData, pauseSearch } from "@src/store/search";
const cacheReq = new Map();
function useCircleFetch<T>() {
  const _chahe = Cache();
  const timeout = setTimeout || setImmediate;
  let timer;
  const dispatch = useDispatch();
  const { token, cancel } = cancelToken();
  const [loading, SetLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [list, setList] = useState<Array<T>>([]);
  let flag = false;
  let prev_video: Video | undefined;
  const request = async (current, params) => {
    
    if (flag) return (flag = false);
    try {
      const res: any = await queryData(params, token);
      switch (res.code) {
        case 0:
          const { data, all_finish } = res;
          const { comments_info, video_info }: CommentsApi = data;
          if (comments_info && comments_info.length > 0) {
            if (prev_video && prev_video.video_id === video_info.video_id) {
              prev_video.list = [...comments_info];
              setList((prev) => {
                return [...prev];
              });
              // setList([...list]);
            } else {
              const video = {
                ...video_info,
                list: comments_info,
              };
              prev_video = video;
              setList((prev) => {
                return [...prev, video] as T[];
              });
            }
          }
          dispatch(
            addHistoryData({
              id: current.id,
              data: prev_video,
              loading: all_finish !== 1,
            })
          );
          if (all_finish === 1) {
            _chahe.set(current, 1);

            SetLoading(false);
            return;
          }
          if (all_finish === 0) {
            timer = timeout(() => request(current, params), 2000);
          }

          break;
        case 3:
          navigate("/login");
          SetLoading(false);
          dispatch(pauseSearch(params.id));
          break;
        default:
          break;
      }
    } catch (error) {
      setError(error);
      SetLoading(false);
      dispatch(pauseSearch(params.id));
      flag = false;
      _chahe.set(current, {
        status: "error",
        data: list,
      });
    }
  };

  const historyQuery = async (current, params) => {
    const [data, error] = await to(queryHistoryData, { id: current.id });
    const { comments_info, video_info } = data as any;
    const list = {
      ...video_info,
      list: comments_info,
    };
    if (!error) {
      _chahe.set(current, 1);
      dispatch(addHistoryData({ id: current.id, data: list, loading: false }));
    }
  };

  const start = debounce((currentItem: SearchsItemType) => {
    if (!currentItem) return;
    if (_chahe.has(currentItem)) {
      const chc = _chahe.get(currentItem);
      // if (chc.status === "success" || chc.status === "success")
      return chc;
    }

    setError(null);
    SetLoading(true);
    const data = {
      id: currentItem.id,
      search_info: currentItem.search,
      ...currentItem.search_params,
    };
    if (currentItem.isHistory) {
      requestIdleCallback(
        () => {
          historyQuery(currentItem, data);
        },
        { timeout: 128 }
      );
      return;
    }
    request(currentItem, data);
  }, 64);

  const pause = () => {
    if (!loading) {
      return;
    }
    flag = true;
    cancel();
    SetLoading(false);
    clearTimeout(timer);
  };
  useEffect(() => {
    // SetLoading(currentSearch.loading);
  });
  return [start, pause, error] as [
    typeof start,
    typeof pause,
    typeof error
  ];
}

export default useCircleFetch;
