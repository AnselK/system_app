export interface queryDataType {}

export interface ResponseObj<T> {
  code: number;
  data: T;
  message: string;
}
