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
import React, { memo, useCallback, useContext, useState,useRef } from "react";
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
import { useForm } from "antd/es/form/Form";

import {PlusOutlined} from"@ant-design/icons";
import DynamicTextAreaForm from "./dynamicTextAreaForm";
import MessageModal from "./messageModal";



const selectOptions = [
  { value: "user_name", label: "用户名称" },
  { value: "comment_text", label: "评论内容" },
  { value: "ip_address", label: "ip" },
];

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { pause, pageType, changePageType, selectedRowKeys, selectRowMap,changeFollowStateAndClear } =
    useContext(pageContext);
  const curreent = useSelector((state: any) => state.main_data.current);
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


  const [modalOpen,setModalOpen] = useState(false)


  const sendMessageModal = () => {
    setModalOpen(true)
  };

  const handleModelClose = () => {
    setModalOpen(false)
  }

  const handleOnSendSuccess = () => {
    console.log(selectRowMap)
    changeFollowStateAndClear();
  }

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
      <MessageModal show={modalOpen} onClose={handleModelClose} onSendSuccess={handleOnSendSuccess} data={[...selectRowMap?.values()!]} 
      searchId={curreent?.id}></MessageModal>
    </div>
  );
};

export default memo(Search);
