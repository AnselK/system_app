import { useEffect, useMemo, useState } from "react";

interface config<T> {
  onSuccess: (data: T) => void;
  onError: (err: any) => void;
}

function useFetch<T extends any>(url: string) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const fetch = useMemo(() => {
    return function <K>(params: K, config?: config<K>) {
        console.log(params,'params');
        
      setLoading(true);
      //   setData()
    };
  }, [url]);

  return [data, fetch, loading, status] as [T, typeof fetch, boolean, boolean];
}

export default useFetch;
