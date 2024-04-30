import React, { memo, useCallback } from "react";
import "./style.less";
import { Button, Input, Space } from "antd";
import useInput from "../DataPage/hooks/useInput";
import {
    ipcRendererSend
} from '@common/desktopUtils'
const VertifyPage = memo(() => {
  const [code, setCode] = useInput();

  const sendVertifyMsg = useCallback((...args)=>{
    ipcRendererSend('main-vertify-success',...args)
  },[])
  
  const vertify = useCallback(() => {
    sendVertifyMsg(code)
  },[]);
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
        <Button onClick={vertify} size="large">启动</Button>
      </Space>
      </div>
    </div>
  );
});

export default VertifyPage;
