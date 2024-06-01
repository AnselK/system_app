import {
  Badge,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
} from "antd";
import React, { memo, useCallback, useContext, useState } from "react";
import {
  SearchOutlined,
  CreditCardOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import type { SearchValue } from "../../type";
import { useNavigate } from "react-router-dom";
import { pageContext } from "../..";
import { debounce } from "@src/common/functionUtils";
import { messageError, messageSuccess } from "@src/common/messageUtil";
import { sendMessage } from "@src/services/data";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addMsg } from "@src/store/message";
const selectOptions = [
  { value: "user_name", label: "用户名称" },
  { value: "comment_text", label: "评论内容" },
  { value: "ip_address", label: "ip" },
];

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { pause, pageType, changePageType, selectedRowKeys, selectRowMap } =
    useContext(pageContext);
  const curreent = useSelector((state: any) => state.main_data.current);
  const [pauseLoading, setPauseLoading] = useState<boolean>(false);
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const onFinish = useCallback(
    (value) => {
      const data = form.getFieldsValue();
      onSearch({ isSearch: false, ...data });
    },
    [onSearch]
  );

  const navigate = useNavigate();

  const resSearch = useCallback(() => {
    const data = form.getFieldsValue();
    pauseSearch();
    navigate("/search");
  }, [onSearch]);

  const pauseSearch = useCallback(async () => {
    setPauseLoading(true);
    await pause();
    setPauseLoading(false);
  }, [onSearch]);
  const typeRadioChange = debounce((e: RadioChangeEvent) => {
    changePageType(e.target.value);
  }, 100);

  const startSend = (data) => {
    debugger
    sendMessage(data)
      .then((res) => {
        messageSuccess("私信发送成功!");
      })
      .catch((err) => {
        messageError("发送私信失败!");
      });
  };
  const [commentForm] = Form.useForm();
  const sendMessageModal = () => {
   
    const messageComponent = (
      <Form form={commentForm}>
        <Form.Item name={"message"}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    );
    Modal.info({
      icon: "",
      title: "私信内容",
      content: messageComponent,
      onOk() {
        const { message } = commentForm.getFieldsValue();
        if (!message.trim()) {
          messageError("请输入私信内容!");
          return Promise.reject();
        }
        // startSend({
        //   msg: message,
        //   homepage_links: [...selectRowMap?.current.values()!],
        // });
        dispatch(addMsg({
          msg: message,
          links: [...selectRowMap?.current.values()!],
        }))
        return Promise.resolve();
      },
    });
  };

  return (
    <div className="search-box">
      <Form<SearchValue> form={form} className="search-form-container">
        <Space
          style={{ width: "100%", justifyContent: "center", padding: 16 }}
          size={"large"}
        >
          <Space.Compact>
            <Form.Item name={"key_word"} initialValue={"user_name"}>
              <Select options={selectOptions} style={{ width: 100 }}></Select>
            </Form.Item>
            <Form.Item name={"search_info"}>
              <Input suffix={<SearchOutlined onClick={onFinish} />}></Input>
            </Form.Item>
          </Space.Compact>
          <Form.Item>
            <Space>
              {curreent?.isHistory ? (
                ""
              ) : (
                <Button danger onClick={pauseSearch} loading={pauseLoading}>
                  停止爬取
                </Button>
              )}
              {/* <Button onClick={resSearch}>重新搜索</Button> */}
              {selectedRowKeys.length === 0 ? (
                <Button
                  disabled={selectedRowKeys.length === 0}
                  onClick={sendMessageModal}
                >
                  私信
                </Button>
              ) : (
                <Badge count={selectedRowKeys.length}>
                  <Button
                    disabled={selectedRowKeys.length === 0}
                    onClick={sendMessageModal}
                  >
                    私信
                  </Button>
                </Badge>
              )}
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <Radio.Group
        onChange={typeRadioChange}
        defaultValue={pageType}
        className="page-type-container"
      >
        <Radio.Button value={"card"}>
          <CreditCardOutlined />
        </Radio.Button>
        <Radio.Button value={"list"}>
          <MenuOutlined />
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default memo(Search);
