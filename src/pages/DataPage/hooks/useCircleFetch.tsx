import { cancelToken } from "@src/common/requestUtils/cancel";
import { queryData } from "@src/services/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function useCircleFetch<T>() {
  const timeout = setTimeout || setImmediate;
  const { token, cancel } = cancelToken();
  const [loading, SetLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [list, setList] = useState<T | Array<any>>([]);
  let flag = false;
  const request = async (params) => {
    if (flag) return (flag = false);
    try {
      const res: any = await queryData(params, token);
      switch (res.code) {
        case 0:
          
          if (res.data.length > 0) {
            // @ts-ignore
            const data = [...list,...res.data]
            setList(data);
          }
          if (res.has_more === 0) {
            SetLoading(false);
            return;
          }
          if (res.has_more === 1) {
            timeout(() => request(params), 2000);
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
  };
  return [list, start, loading, pause, error] as [
    T,
    typeof start,
    boolean,
    typeof pause,
    typeof error
  ];
}

export default useCircleFetch;
