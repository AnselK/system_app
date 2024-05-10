import { Descriptions, Table } from "antd";
import type { TableProps } from "antd";
import React, { memo } from "react";
import type { Comment, Video } from "../../../type";
import "../index.less";

interface CardProps {
  data: Video;
}

const Card: React.FC<CardProps> = ({ data }) => {
  const descs = [
    {
      label: "作者",
      children: "author_name",
    },
    {
      label: "点赞数量",
      children: "digg_count",
    },
    {
      label: "时长",
      children: "duration",
    },
  ];
  const getTime = (time: any) => {
    return new Date(time).getTime();
  };

  const sortTime = (a: Comment, b: Comment) => {
    return getTime(a.comment_time) - getTime(b.comment_time);
  };
  const columns: TableProps<Comment>["columns"] = [
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
      render: (value: any, record: Comment, index: number) => {
        return <span>{value}</span>;
      },
    },
  ];

  return (
    <div className="data-list-card">
      <Descriptions title={`视频标题：${data.title}`}>
        {descs.map((item) => (
          <Descriptions.Item key={data.video_id} label={item.label}>
            {data[item.children]}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <div className="data-list-table">
        <Table columns={columns} dataSource={data.list}></Table>
      </div>
    </div>
  );
};

export default memo(Card);
