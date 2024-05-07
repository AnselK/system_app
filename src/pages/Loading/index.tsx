import React, { memo, useEffect } from "react";
import "./style.less";
import { ipcRendererOn } from "@common/desktopUtils";
import { useNavigate } from "react-router-dom";
import { vertifyCode } from "@src/services/vertify";
const Loading = () => {
  const navigate = useNavigate();
  const vertify = (code: string) => {
    vertifyCode(code)
      .then((res: any) => {
        if (res.activation_code_status === true) {
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
    ipcRendererOn("server-success", () => {
      console.log("success");
    });
    ipcRendererOn("server-error", () => {
      navigate("/500");
    });
    ipcRendererOn("user-code", (e,code: string) => {
      console.log(code, "user-code");
      if (!code) {
        navigate("/login");
      } else {
        vertify(code);
      }
    });
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
