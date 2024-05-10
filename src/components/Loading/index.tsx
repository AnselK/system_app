import React, { memo, useEffect, useState } from "react";
import "./style.less";
import { ipcRendererOn, ipcRendererSend } from "@common/desktopUtils";
import { useNavigate } from "react-router-dom";
import { vertifyCode } from "@src/services/vertify";
const Loading = () => {
  // wrtweurodbasdasdsdaa
  const navigate = useNavigate();
  const vertify = (code: string) => {
    vertifyCode(code)
      .then((res: any) => {
        if (res.activation_code_status === true) {
          ipcRendererSend("vertify-code-success", code);
          navigate("/home");
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        navigate("/login");
      });
  };
  useEffect(() => {
    ipcRendererOn("server-success", (e, code: string) => {
    });
    ipcRendererOn("server-error", (e, error) => {
      console.log(error, "error");

      navigate("/500");
    });
    ipcRendererOn("user-code", (e, code: string) => {
      if (!code) {
        navigate("/login");
      } else {
        vertify(code);
      }
    });
    ipcRendererSend("mainWindow-rendered");
    // navigate("/home");
  }, []);
  return (
    <div className="pro-loading">
      <div className="loading-conainer">
        <div className="loading">
          <span></span>
          <span>服务启动中...</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Loading);
