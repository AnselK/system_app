import to from "@src/common/requestUtils/to";
import { ResponseObj } from "@src/services/interface";
import { useState } from "react";

const useLoading = <T>(api: () => Promise<ResponseObj<T>>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const request = async <K>(...args: any[]) => {
    setLoading(true);
    const [data, err] = await to<T, K>(api, ...args);
    setLoading(false);
    return [data, err];
  };
  return [request, loading] as [typeof request, boolean];
};

export default useLoading;
