import { cancelToken } from "@src/common/requestUtils/cancel";
import { queryData, queryHistoryData } from "@src/services/data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommentsApi, Video } from "../type";
import Cache from "../_cache/classes";
import { debounce } from "@src/common/functionUtils";
import { SearchsItemType } from "@src/store/search/interface";
import to from "@src/common/requestUtils/to";
import { messageError } from "@src/common/messageUtil";
const cacheReq = new Map();
function useCircleFetch<T>() {
  const _chahe = Cache();
  const timeout = setTimeout || setImmediate;
  let timer;
  const { token, cancel } = cancelToken();
  const [loading, SetLoading] = useState<boolean>(true);
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [list, setList] = useState<Array<T>>([]);
  let flag = false;
  let prev_video: Video | undefined;
  const request = async (current, params) => {
    setOnSearch(true)
    if (flag) return (flag = false);
    try {
      const res: any = await queryData(params, token);
      switch (res.code) {
        case 0:
          const { data, all_finish } = res;
          const { comments_info, video_info }: CommentsApi = data;
          if (comments_info && comments_info.length > 0) {
            if (prev_video && prev_video.video_id === video_info.video_id) {
              prev_video.list = [...prev_video.list, ...comments_info];

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

          if (all_finish === 1) {
            _chahe.set(current, {
              status: "success",
              data: list,
            });
            setOnSearch(false)
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
          break;
        default:
          break;
      }
    } catch (error) {
      setError(error);
      SetLoading(false);
      flag = false;
      _chahe.set(current, {
        status: "error",
        data: list,
      });
    }
  };

  const historyQuery = async (current, params) => {
    const [data, error,res] = await to<any,any>(queryHistoryData, { id: current.id });
    const arr:any = []
    data.forEach(e => {
      arr.push({
        ...e.video_info,
        list:e.comments_info
      })
    });
      setList(arr)
      _chahe.set(current, {
        status: "success",
        data: arr,
      });
  };

  const start = debounce((currentItem: SearchsItemType) => {
    if(onSearch){
      messageError("请等待搜索完毕或停止搜索后再进行操作")
      return
    }
    if (!currentItem) return;
    if (_chahe.has(currentItem)) {
      const chc = _chahe.get(currentItem);
      // if (chc.status === "success" || chc.status === "success")
      setList(chc.data)
      return
    }

    setError(null);
    SetLoading(true);
    const data = {
      id: currentItem.id,
      search_info: currentItem.search,
      ...currentItem.search_params,
    };
    if (currentItem.isHistory) {
      historyQuery(currentItem, data);
      SetLoading(false)
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
    setOnSearch(false)
    clearTimeout(timer);
  };
  return [list, start, loading, pause, error] as [
    Array<T>,
    typeof start,
    boolean,
    typeof pause,
    typeof error
  ];
}

export default useCircleFetch;
