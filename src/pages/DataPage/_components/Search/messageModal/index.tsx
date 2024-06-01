import React, { useContext, useRef, useState } from "react";
import { Space, Modal, Button, Badge } from "antd";
import DynamicTextAreaForm from "../dynamicTextAreaForm";
import { sendMessage } from "@src/services/data";
import { messageSuccess, messageError } from "@src/common/messageUtil";
import { pageContext } from "@src/pages/DataPage";
import { useDispatch } from "react-redux";
import { addMsg } from "@src/store/message";

const MessageModal = ({ searchId }) => {
  const { selectedRowKeys, selectRowMap } = useContext(pageContext);
  const [loading, SetLoading] = useState(false);
  const formRef = useRef<any>();
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useDispatch();
  const doSendMessage = async (doMessage) => {
    const sendData = {
      do_message: doMessage,
      msgs: [],
      data: [...selectRowMap?.current.values()!],
      searchId: searchId,
    };
    if (doMessage) {
      sendData.msgs = formRef.current?.getMessages?.();
      //   if (messageJson) {
      //     sendData.msgs = JSON.parse(messageJson);
      //   }
    }
    SetLoading(true);
    dispatch(addMsg(sendData));
    // await sendMessage(sendData)
    //   .then((res: any) => {
    //     if (res.code === 0) {
    //       onSendSuccess();
    //       messageSuccess("私信发送成功!");
    //     } else {
    //       messageError(res.msg);
    //     }
    //     SetLoading(false);
    //   })
    //   .catch((err) => {
    //     messageError("发送私信失败!");
    //     SetLoading(false);
    //   });
    // onClose();
  };

  const onClose = () => {
    setShow(false);
  };

  return (
    <>
      {selectedRowKeys.length === 0 ? (
        <Button disabled={selectedRowKeys.length === 0}>私信</Button>
      ) : (
        <Badge count={selectedRowKeys.length}>
          <Button
            disabled={selectedRowKeys.length === 0}
            onClick={() => setShow(true)}
          >
            私信
          </Button>
        </Badge>
      )}

      <Modal
        open={show}
        title="私信（执行私信时是会随机选取其中的一条）"
        onCancel={onClose}
        onOk={onClose}
        footer={
          <Space>
            <Button onClick={onClose}>返回</Button>
            <Button
              loading={loading}
              onClick={() => {
                doSendMessage(true);
              }}
            >
              关注+私信
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                doSendMessage(false);
              }}
            >
              仅关注
            </Button>
          </Space>
        }
      >
        <DynamicTextAreaForm searchId={searchId} ref={formRef} />
      </Modal>
    </>
  );
};

export default MessageModal;
