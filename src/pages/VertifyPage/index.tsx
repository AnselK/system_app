import React, { memo, useCallback } from "react";
import "./style.less";
import { Button, Input, message, Space } from "antd";
import useInput from "../DataPage/hooks/useInput";
import { ipcRendererSend } from "@common/desktopUtils";
import { vertifyCode } from "@src/services/vertify";
import { useNavigate } from "react-router-dom";
import { messageError } from "@src/common/messageUtil";
const VertifyPage = memo(() => {
  const [code, setCode] = useInput<string>();
  const navigate = useNavigate();
  const sendVertifyMsg = useCallback((...args) => {
    ipcRendererSend("main-vertify-success", ...args);
  }, []);

  const vertify = useCallback(() => {
    vertifyCode(code)
      .then((res: any) => {
        if (res.code === 0 && res.activation_code_status) {
          navigate("/home");
        } else {
          messageError("激活码校验失败");
        }
      })
      .catch((err) => {
        messageError("激活码校验失败");
      });
  }, []);
  return (
    <div className="vertify-page">
      <div className="vertify-page-content">
        <Space>
          <Input
            value={code}
            onChange={setCode}
            placeholder="请输入激活码"
            size="large"
            style={{
              width: "300px",
            }}
          ></Input>
          <Button onClick={vertify} size="large">
            启动
          </Button>
        </Space>
      </div>
    </div>
  );
});

export default VertifyPage;
