import React, { useState } from "react";
import{ Space,Modal,Button } from "antd";
import DynamicTextAreaForm from "../dynamicTextAreaForm";
import { sendMessage } from "@src/services/data";
import { messageSuccess,messageError } from "@src/common/messageUtil";

const MessageModal = ({show,onClose,data,onSendSuccess,searchId}) => {
    
    const [loading,SetLoading] = useState(false)

    const doSendMessage = async (doMessage) => {
        const sendData = {
            do_message:doMessage,
            msgs:[],
            data:[],
            searchId:searchId
        }
        if(doMessage){
            const messageJson = localStorage.getItem("messages");
            if(messageJson){
                sendData.msgs = JSON.parse(messageJson);
            }
        }
        sendData.data = data;
        SetLoading(true)
        await sendMessage(sendData)
                    .then((res:any) => {
                        if(res.code ===  0){
                            onSendSuccess();
                            messageSuccess("私信发送成功!");
                        }else{
                            messageError(res.msg)
                        }
                        SetLoading(false)
                    })
                    .catch((err) => {
                        messageError("发送私信失败!");
                        SetLoading(false)
                    });
        onClose();
    }

    return (
        <Modal
        open={show}
        title="私信（执行私信时是会随机选取其中的一条）"
        onCancel={onClose}
        onOk={onClose}
        footer= {<Space>
                             <Button onClick={onClose}>返回</Button>
                             <Button loading={loading} onClick={() => {doSendMessage(true)}}>关注+私信</Button>
                             <Button loading={loading} onClick={() => {doSendMessage(false)}}>仅关注</Button></Space>}
        >
            <DynamicTextAreaForm/>
        </Modal>
        
    )

}


export default MessageModal;