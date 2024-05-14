import React, { memo, useContext } from "react";
import type { Comment } from "../../../type";
import { Table } from "antd";
import { columns } from "../Card";
import { selectionText } from "../Selection";
interface TableListProps {
  dataSource: Comment[];
  loading?: boolean;
}
const TableList: React.FC<TableListProps> = ({
  dataSource,
  loading = false,
}) => {
  const { rowSelection,rowKey } = useContext(selectionText);
  return (
    <Table
      columns={columns}
      dataSource={dataSource as Comment[]}
      className="list-table"
      scroll={{ y: 700 }}
      rowKey={rowKey}
      virtual
      rowSelection={rowSelection}
      loading={loading}
    ></Table>
  );
};
export default memo(TableList);
