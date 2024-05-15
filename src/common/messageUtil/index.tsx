import { message } from "antd";

export const messageError = (msg: string | React.ReactNode) => {
  message.error({
    content: msg,
  });
};
export const messageSuccess = (msg: string | React.ReactNode) => {
  message.success({
    content: msg,
  });
};
