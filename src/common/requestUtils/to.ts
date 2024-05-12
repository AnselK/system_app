import { ResponseObj } from "@src/services/interface";

const to = async <T, K>(
  fn: (params?: K) => Promise<ResponseObj<T>>,
  params?: K
) => {
  let dataSource: T | undefined = undefined;
  let error: boolean = false;
  let response: ResponseObj<T> | undefined;
  try {
    const res = await fn(params);
    const { data, code } = res;
    if (code === 0) {
      dataSource = data;
    } else {
      error = true;
    }
    response = res;
  } catch (err) {
    error = true;
  }
  return [dataSource, error, response];
};

export default to;
