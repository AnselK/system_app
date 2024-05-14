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
import { messageError } from "@src/common/messageUtil";
const selectOptions = [
  { value: "user_name", label: "用户名称" },
  { value: "comment_text", label: "评论内容" },
  { value: "ip_address", label: "ip" },
];

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { pause, pageType, changePageType, selectedRowKeys } =
    useContext(pageContext);
  const [pauseLoading, setPauseLoading] = useState<boolean>(false);
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
  
  const sendMessage = () => {
    const [form] = Form.useForm()
    const messageComponent = (<Form form={form}>
      <Form.Item name={'message'}>
        <Input.TextArea></Input.TextArea>
      </Form.Item>
    </Form>)
    const modal = Modal.info({
      icon: "",
      title: "私信内容",
      content:messageComponent,
      onOk() {
        const {message} = form.getFieldsValue()
        if(!message.trim()){
          messageError('请输入私信内容!')
          return Promise.reject()
        }
        modal.destroy()
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
              <Button danger onClick={pauseSearch} loading={pauseLoading}>
                停止
              </Button>
              <Button onClick={resSearch}>重新搜索</Button>
              {selectedRowKeys.length === 0 ? (
                <Button
                  disabled={selectedRowKeys.length === 0}
                  onClick={sendMessage}
                >
                  私信
                </Button>
              ) : (
                <Badge count={selectedRowKeys.length}>
                  <Button
                    disabled={selectedRowKeys.length === 0}
                    onClick={sendMessage}
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
