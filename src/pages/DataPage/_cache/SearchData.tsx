import { Dispatch, SetStateAction, useState } from "react";
import type { CommentsApi, Video } from "../type.ts";
import { queryData, queryHistoryData } from "@src/services/data.ts";
// import type {Dispatch} from 'react-redux'
import { useDispatch } from "react-redux";
import { CancelTokenSource } from "axios";
import { cancelToken } from "@src/common/requestUtils/cancel.ts";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { addHistoryData } from "@src/store/search/index.tsx";
import { SearchsItemType } from "@src/store/search/interface.ts";
import to from "@src/common/requestUtils/to.ts";
const timeout = setTimeout || setImmediate;

interface action {
  use_State: Dispatch<SetStateAction<Video[]>>;
  dispatch: Dispatch<any>;
  navigate: NavigateFunction;
  state: Video[] | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean | undefined;
}

class DataSeaarch {
  data: Video[] = [];
  #s_id: string;
  SET_ACTION: Dispatch<SetStateAction<Video[]>>;
  #flag: boolean = false;
  #fetchToken: CancelTokenSource["token"];
  dispatch;
  loading: boolean | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
  timer;
  prev_video: Video | undefined;
  #cancel: CancelTokenSource["cancel"];
  current: SearchsItemType;
  constructor(
    key: string,
    info: SearchsItemType,
    { use_State, dispatch, navigate, state, setLoading, loading }: action
  ) {
    this.#s_id = key;
    this.data = state!;
    // this.SET_ACTION = use_State!;
    const { token, cancel } = cancelToken();
    this.#fetchToken = token;
    this.#cancel = cancel;
    this.dispatch = dispatch;
    this.navigate = navigate;
    // this.setLoading = setLoading;
    this.loading = loading;
    if (info.isHistory) {
      requestIdleCallback(this.workLoop);
    } else {
      const data = {
        id: info.id,
        search_info: info.search,
        ...info.search_params,
      };

      this.start(data);
    }
  }

  start(info: any) {
    const request = async (params) => {
      if (this.#flag) return (this.#flag = false);
      try {
        const res: any = await queryData(params, this.#fetchToken);
        switch (res.code) {
          case 0:
            const { data, all_finish } = res;
            const { comments_info, video_info }: CommentsApi = data;
            if (comments_info && comments_info.length > 0) {
              if (
                this.prev_video &&
                this.prev_video.video_id === video_info.video_id
              ) {
                this.prev_video.list = [...comments_info];
                this.SET_ACTION((prev) => {
                  return [...prev];
                });
              } else {
                const video = {
                  ...video_info,
                  list: comments_info,
                };
                this.prev_video = video;
                this.SET_ACTION((prev) => {
                  return [...prev, video] as Video[];
                });
              }
            }

            if (all_finish === 1) {
              this.setLoading(false);
              return;
            }
            if (all_finish === 0) {
              this.timer = timeout(() => this.start(params), 2000);
            }

            break;
          case 3:
            this.navigate("/login");
            this.setLoading(false);
            break;
          default:
            break;
        }
      } catch (error) {
        //   setError(error);
        this.setLoading(false);
        this.#flag = false;
      }
    };
    requestIdleCallback(() => request(info), { timeout: 128 });
  }
  pause() {
    if (!this.loading) {
      return;
    }
    this.#flag = true;
    this.#cancel();
    this.setLoading(false);
    clearTimeout(this.timer);
  }
  workLoop(deadline: IdleDeadline) {
    while (deadline.timeRemaining() > 0 && this.loading) {
      this.queryHistory();
    }
    if (this.loading) {
      requestIdleCallback(this.workLoop);
    }
  }
  queryHistory() {
    const request = async () => {
      const [list, error] = await to<Video[], any>(queryHistoryData, {
        id: this.current.id,
      });
      if (!error) {
        this.SET_ACTION(list);
      }
    };
    request();
  }
  get dataSource() {
    return this.data;
  }
}

export default DataSeaarch;
