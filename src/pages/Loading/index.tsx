import React, { memo, useEffect } from "react";
import "./style.less";
import { ipcRendererOn, ipcRendererSend } from "@common/desktopUtils";
import { useNavigate } from "react-router-dom";
import { vertifyCode } from "@src/services/vertify";
import { useDispatch } from "react-redux";
import { changeServerStatus } from "@src/store/users";
import { useSelector } from "react-redux";
const Loading = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverSatatus = useSelector((state: any) => state.server.started);
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
    if (!serverSatatus) {
      ipcRendererSend("mainWindow-vertify-serve");
    }
    ipcRendererOn("server-success", () => {
      dispatch(changeServerStatus(true));
      console.log("success");
    });
    ipcRendererOn("server-error", () => {
      dispatch(changeServerStatus(false));
      navigate("/500");
    });
    ipcRendererOn("user-code", (e, code: string) => {
      console.log(code, "user-code");
      if (!code) {
        navigate("/login");
      } else {
        vertify(code);
      }
    });
    // navigate("/search");
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
