import request from "@src/common/requestUtils";
import { queryDataType } from "./interface";

export const queryData = <T>(data: queryDataType,cancelToken): Promise<T> => {
  return request({
    method: "POST",
    params:data,
    url: "/get_comments",
    cancelToken
  });
};

export const stopQueryData = <T>(params?: any): Promise<T> => {
  return request({
    method: "GET",
    params,
    url: "/stop_crawler",
  });
};
