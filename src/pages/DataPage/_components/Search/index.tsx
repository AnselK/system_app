import {
  Button,
  Form,
  Input,
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
const selectOptions = [
  { value: "user_name", label: "用户名称" },
  { value: "comment_text", label: "评论内容" },
  { value: "ip_address", label: "ip" },
];

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { pause, pageType, changePageType } = useContext(pageContext);
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
              <Button>保存</Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <Radio.Group onChange={typeRadioChange} defaultValue={pageType} className="page-type-container">
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
