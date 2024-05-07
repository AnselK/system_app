import React, { memo, useCallback } from "react";
import "./style.less";
import { Button, Form, Input, message, Space } from "antd";
import useInput from "../DataPage/hooks/useInput";
import { ipcRendererSend } from "@common/desktopUtils";
import { vertifyCode } from "@src/services/vertify";
import { useNavigate } from "react-router-dom";
import { messageError } from "@src/common/messageUtil";
const VertifyPage = memo(() => {
  const navigate = useNavigate();
  const sendVertifyMsg = useCallback((...args) => {
    ipcRendererSend("main-vertify-success", ...args);
  }, []);

  const vertify = useCallback((values) => {
    vertifyCode(values.code)
      .then((res: any) => {
        if (res.code === 0 && res.activation_code_status) {
          sendVertifyMsg(values.code)
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
        <Form onFinish={vertify}>
          <Space>
            <Form.Item name={"code"}>
              <Input
                placeholder="请输入激活码"
                size="large"
                style={{
                  width: "300px",
                }}
              ></Input>
            </Form.Item>
            <Form.Item>
              <Button size="large" htmlType="submit">
                启动
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
    </div>
  );
});

export default VertifyPage;
