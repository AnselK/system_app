import { Progress, Tooltip } from "antd";
import React, { memo, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PostMsg from "./postMsg";
import { useDispatch } from "react-redux";
import { doneMsg, allDonedMsg } from "@src/store/message";

const MsgComponent = () => {
  const msgs: Array<any> = useSelector((state: any) => state.msg_store.msgs);
  const dispatch = useDispatch();
  const PM = new PostMsg((data) => {
    dispatch(doneMsg(data));
  });
  const dones = useSelector((state: any) => state.msg_store.done);
  const messages = useMemo(() => {
    return msgs.reduce((prev, cur) => {
      prev += cur?.data?.length;

      return prev;
    }, 0);
  }, [msgs]);

  useEffect(() => {
    if (messages === dones.length && messages !== 0) {
      dispatch(allDonedMsg(""));
    }
  }, [dones]);

  const msgList = () => {
    return <div>{msgs.length}</div>;
  };
  useEffect(() => {
    if (msgs.length === 0) return;
    PM.add(msgs);
  }, [msgs]);
  return (
    <>
      {messages === 0 ? (
        ""
      ) : (
        <Tooltip title={msgList}>
          <Progress percent={(dones.length / messages) * 100}></Progress>
        </Tooltip>
      )}
    </>
  );
};

export default memo(MsgComponent);
