import { cancelToken } from "@src/common/requestUtils/cancel";
import { queryData } from "@src/services/data";
import { useState } from "react";

function useCircleFetch<T>() {
  const timeout = setTimeout || setImmediate;
  const { token, cancel } = cancelToken();
  const [loading, SetLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T>();
  let flag = false;
  const request = async (data) => {
    if (flag) return (flag = false);
    try {
      const res: any = await queryData(data,token);
      if (res.code === 0) {
        if (res.has_more === 0) {
          SetLoading(false);
          return;
        }
        // @ts-ignore
        setData([...data, , ...res.data]);
        if (res.has_more === 1) {
          timeout(() => request(data), 1000);
        }
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
  };
  return [data, start, loading, pause, error] as [
    typeof data,
    typeof start,
    boolean,
    typeof pause,
    typeof error
  ];
}

export default useCircleFetch;
