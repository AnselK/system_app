import request from "@src/common/requestUtils";
import { queryDataType } from "./interface";

export const queryData = <T>(data: queryDataType, cancelToken): Promise<T> => {
  return request({
    method: "POST",
    params: data,
    url: "/get_comments",
    cancelToken,
  });
};

export const queryHistoryData = <T>(data: queryDataType): Promise<T> => {
  return request({
    method: "POST",
    params: data,
    url: "/search/history/comment",
  });
};

export const stopQueryData = <T>(params?: any): Promise<T> => {
  return request({
    method: "GET",
    params,
    url: "/stop_crawler",
  });
};

export const sendMessage = <T>(params?: any): Promise<T> => {
  return request({
    method: "POST",
    params,
    url: "/follow_send_msg",
  });
};

export const getHistorySearch = <T>(params?: any): Promise<T> => {
  return request({
    method: "GET",
    params,
    url: "/search/history",
  });
};

export const deleteHistorySearch = <T>(params?: any): Promise<T> => {
  return request({
    method: "DELETE",
    params,
    url: "/search/history/del",
  });
};
