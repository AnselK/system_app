import { Descriptions, Table ,Tag} from "antd";
import type { TableProps } from "antd";
import React, { memo, useContext, useState } from "react";
import type { Comment, Video } from "../../../type";
import { selectionText } from "../Selection";
import { messageSuccess,messageError } from "@src/common/messageUtil";

interface CardProps {
  data: Video;
  dataSource: Comment[];
}

const getTime = (time: any): any => {
  return new Date(time);
};

const sortTime = (a: Comment, b: Comment) => {
  return getTime(a.comment_time) - getTime(b.comment_time);
};

const handleCopy = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    messageSuccess('复制成功√');
  }).catch(err => {
    messageError("复制失败")
  });
};

export const columns: TableProps<Comment>["columns"] = [
  {
    title: "用户id",
    dataIndex: "uid",
    key: "uid",
    ellipsis: true,
    width: 100,
  },
  {
    title: "用户名称",
    dataIndex: "user_name",
    key: "user_name",
    ellipsis: true,
    width: 120,
  },
  {
    title: "是否已关注过",
    dataIndex: "has_letter",
    key: "has_letter",
    ellipsis: true,
    width: 140,
    render: (value: any, record: Comment, index: number) => {
      return <Tag color={value === 1?"green":"red"}>{value===1?"是":"否"}</Tag>
    },
  },
  {
    title: "评论时间",
    dataIndex: "comment_time",
    key: "comment_time",
    sorter: sortTime,
    ellipsis: true,
    width: 120,
  },
  {
    title: "评论内容",
    dataIndex: "comment_text",
    key: "comment_text",
    ellipsis: true,
    width: 180,
  },
  {
    title: "ip",
    dataIndex: "ip_address",
    key: "ip_address",
    ellipsis: true,
    width: 60,
  },
  
  {
    title: "主页",
    dataIndex: "homepage_link",
    key: "homepage_link",
    ellipsis: true,
    width: 140,
    render: (value: any, record: Comment, index: number) => {
      return <span style={{ cursor: 'pointer'}} onClick={() => handleCopy(value)}>{value}</span>;
    },
  }
];

const Card: React.FC<CardProps> = ({ data, dataSource }) => {
  const descs = [
    {
      label: "作者",
      children: "author_name",
      key: "author_name",
    },
    {
      label: "点赞数量",
      children: "digg_count",
      key: "digg_count",
    },
    {
      label: "时长",
      children: "duration",
      key: "duration",
    },
  ];

  const { rowSelection, rowKey } = useContext(selectionText);

  return (
    <div className="data-list-card">
      <Descriptions
        title={`视频标题：${data.title}`}
        className="data-list-desc"
      >
        {descs.map((item) => (
          <Descriptions.Item key={item.key} label={item.label}>
            {data[item.children]}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <div className="data-list-table">
        <Table
          columns={columns}
          rowKey={rowKey}
          dataSource={dataSource}
          scroll={{ y: 560 }}
          rowSelection={rowSelection}
        ></Table>
      </div>
    </div>
  );
};

export default memo(Card);
