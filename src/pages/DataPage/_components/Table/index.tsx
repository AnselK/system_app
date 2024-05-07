import { Table, Form, Space, Select, Input, Button } from "antd";
import type { TableProps } from "antd";
import React, { memo, useContext, useEffect, useState } from "react";
import { searchProps } from "../../type";
import "./index.less";
import useCircleFetch from "../../hooks/useCircleFetch";
import { pageContext } from "../..";
interface user {
  uid: string;
  user_name: string;
  comment_time: string;
  comment_text: string;
  ip_address: string;
  homepage_link: string;
}
type propsType = {
  data: user[];
};
const TableC = (props: propsType) => {
  const { data } = props;
  const [dataSource, setdDataSource] = useState<user[]>();
  const [loading, setLoading] = useState<boolean>();
  const { searchLoading } = useContext(pageContext);

  const getTime = (time: any) => {
    return new Date(time).getTime();
  };

  const [form] = Form.useForm();

  const sortTime = (a: user, b: user) => {
    return getTime(a.comment_time) - getTime(b.comment_time);
  };
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
      sorter: sortTime,
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
  const selectOptions = [
    { value: "user_name", label: "用户名称" },
    { value: "comment_text", label: "评论内容" },
    { value: "ip_address", label: "ip" },
  ];

  useEffect(() => {
    setdDataSource(data);
    form.resetFields()
  }, [data]);

  const onFinish = (value) => {
    setLoading(true);
    if (data.length === 0) return;
    if (!value.search_value.trim()) return setdDataSource(data);
    const filterData = data.filter((item: user) => {
      const key = value.search_type;
      return item[key].indexOf(value.search_value) > -1;
    });
    setdDataSource(filterData);
    setLoading(false);
  };

  return (
    <div className="table-page">
      <Form form={form} onFinish={onFinish}>
        <Space>
          <Space.Compact>
            <Form.Item name={"search_type"} initialValue={"user_name"}>
              <Select options={selectOptions} style={{ width: 120 }}></Select>
            </Form.Item>
            <Form.Item name={"search_value"}>
              <Input></Input>
            </Form.Item>
          </Space.Compact>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={searchLoading}>
              搜索
            </Button>
          </Form.Item>
        </Space>
      </Form>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading || searchLoading}
      ></Table>
    </div>
  );
};

export default memo(TableC);
