import { Progress, Tooltip } from "antd";
import React, { memo, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PostMsg from "./postMsg";
import { useDispatch } from "react-redux";

const MsgComponent = () => {
  const msgs: Array<any> = useSelector((state: any) => state.msg_store.msgs);
  const PM = new PostMsg();
  const dones = useSelector((state: any) => state.msg_store.done);
  const messages = useMemo(() => {
    return msgs.reduce((prev, cur) => {
      prev.push(cur.links);
      return prev;
    }, []);
  }, [msgs]);
  const messageDones = useMemo(() => {
    return dones.reduce((prev, cur) => {
      prev.push(cur.links);
      return prev;
    }, []);
  }, [dones]);

  const msgList = () => {
    return <div>{msgs.length}</div>;
  };
  return (
    <>
      {messages.length === 0 ? (
        ""
      ) : (
        <Tooltip title={msgList}>
          <Progress
            percent={
              (messageDones.length / (messageDones.length + messages.length)) *
              100
            }
          ></Progress>
        </Tooltip>
      )}
    </>
  );
};

export default memo(MsgComponent);
