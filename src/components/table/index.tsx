import { Form, Table, Button, Input } from "antd";
import type { FormProps, TableProps } from "antd";
import React, { useState, memo } from "react";
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

function TableIndex() {
  const [data, setData] = useState<Array<user>>([]);
  const columns: TableProps<user>["columns"] = [
    {
      title: "用户id",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "用户名称",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "评论时间",
      dataIndex: "comment_time",
      key: "comment_time",
    },
    {
      title: "评论内容",
      dataIndex: "comment_text",
      key: "comment_text",
    },
    {
      title: "ip",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "主页",
      dataIndex: "homepage_link",
      key: "homepage_link",
      render: (value: any, record: user, index: number) => {
        return <span>{value}</span>;
      },
    },
  ];
  const onFinish: FormProps<search>["onFinish"] = (values) => {

  };
  return (
    <div>
      <div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item name={"search_content"}>
            <Input></Input>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table columns={columns} dataSource={data}></Table>
    </div>
  );
};

export default memo(TableIndex)
