import { Button, Form, Input, Select, Space } from "antd";
import React, { memo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { SearchValue } from '../../type'
const selectOptions = [
  { value: "user_name", label: "用户名称" },
  { value: "comment_text", label: "评论内容" },
  { value: "ip_address", label: "ip" },
];

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [form] = Form.useForm();
  const onFinish = (value) => {
    onSearch({ isSearch: true, ...value });
  };

  const onFilter = () => {

    console.log('on');
    
    const data = form.getFieldsValue();
    onSearch({ isSearch: false, ...data });
  };

  return (
    <div>
      <Form<SearchValue> onFinish={onFinish} form={form}>
        <Space
          style={{ width: "100%", justifyContent: "center", padding: 16 }}
          size={"large"}
        >
          <Space.Compact>
            <Form.Item name={"key_word"} initialValue={"user_name"}>
              <Select options={selectOptions} style={{ width: 100 }}></Select>
            </Form.Item>
            <Form.Item name={"search_info"}>
              <Input suffix={<SearchOutlined onClick={onFilter}  />}></Input>
            </Form.Item>
          </Space.Compact>
          <Form.Item>
            <Space>
              <Button danger>停止</Button>
              <Button htmlType="submit">重新搜索</Button>
              <Button>保存</Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default memo(Search);
