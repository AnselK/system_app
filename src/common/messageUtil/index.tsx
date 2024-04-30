import { message } from "antd";

export const messageError = (msg: string | React.ReactNode) => {
  message.error({
    content: msg,
  });
};
