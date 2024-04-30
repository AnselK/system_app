import { Table } from "antd";
import type { TableProps } from "antd";
import React, { memo, useContext, useEffect } from "react";
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
  search?: searchProps;
};
const TableC = (props: propsType) => {
  const { search } = props;
  const [dataSource, start, loading, pause] = useCircleFetch<Array<user>>();
  const { changeLoading, pauseStatus } = useContext(pageContext);
  const getTime = (time:any)=>{
    return new Date(time).getTime()
  }

  const sortTime = (a:user,b:user)=>{
    return getTime(a.comment_time) - getTime(b.comment_time)
  }
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

  useEffect(() => {
    if(!pauseStatus){

      if(search){
        start(search);
      }
    }else {
      if(loading){
        pause()
      }
    }
  }, [search,pauseStatus]);

  useEffect(() => {
    changeLoading(loading);
  }, [loading]);

  return (
    <div className="table-page">
      <Table columns={columns} dataSource={dataSource} loading={loading}></Table>
    </div>
  );
};

export default memo(TableC);
