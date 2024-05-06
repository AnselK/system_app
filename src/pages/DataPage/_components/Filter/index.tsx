import { Button, Space, Input, Select, Form } from "antd";
import type { ButtonProps, FormProps } from "antd";
import React, { memo, useContext } from "react";
import useInput from "../../hooks/useInput";
import "./index.less";
import { pageContext } from "../..";
interface user {
  uid: string;
  user_name: string;
  comment_time: string;
  comment_text: string;
  ip_address: string;
  homepage_link: string;
}

type select = Partial<Pick<user, "user_name" | "comment_time" | "ip_address">>;

interface search {
  search_content: string;
}

type sel = "select";

const Filter = ({ onSearch }) => {
  const { searchLoading, pause } = useContext(pageContext);
  const [form] = Form.useForm();
  const onFinish = (value) => {
    if (!value.search_info.trim()) return;
    onSearch({ ...value });
  };

  const onPause = () => {
    // if (!searchLoading) return;
    pause(true);
  };

  return (
    <div className="filter-form">
      <Form form={form} onFinish={onFinish}>
        <Space size="large">
          <Space.Compact>
            {/* <Form.Item name={"searchCol"} initialValue={"user_name"}>
              <Select options={selectOptions}></Select>
            </Form.Item> */}
            <Form.Item name={"search_info"}>
              <Input></Input>
            </Form.Item>
          </Space.Compact>
          <Form.Item>
            <Space>
              <Button type="primary" disabled={searchLoading} htmlType="submit">
                搜索
              </Button>
              <Button
                type="primary"
                onClick={onPause}
              >
                停止
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default memo(Filter);
