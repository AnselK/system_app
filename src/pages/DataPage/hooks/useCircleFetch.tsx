import { cancelToken } from "@src/common/requestUtils/cancel";
import { queryData } from "@src/services/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommentsApi, Video } from "../type";

function useCircleFetch<T>() {
  const timeout = setTimeout || setImmediate;
  let timer;
  const { token, cancel } = cancelToken();
  const [loading, SetLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [list, setList] = useState<Array<T>>([]);
  let flag = false;
  let prev_video: Video | undefined;
  const request = async (params) => {
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
              // @ts-ignore
              const dataArray: Array<T> = [...list, video];
              setList((prev) => {
                return [...prev, video] as T[];
              });
            }
          }

          if (all_finish === 1) {
            SetLoading(false);
            return;
          }
          if (all_finish === 0) {
            timer = timeout(() => request(params), 2000);
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
    }
  };

  const start = (data) => {
    setError(null);
    SetLoading(true);
    request(data);
  };

  const pause = () => {
    flag = true;
    cancel();
    SetLoading(false);
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
