import { TableRowSelection } from "antd/es/table/interface";
import React, { memo, createContext, useContext } from "react";
import { Comment } from "../../../type";
import { pageContext } from "@src/pages/DataPage";
import { TableProps } from "antd";

type SelectionTextProps = {
  rowSelection: TableRowSelection<Comment>;
  rowKey: TableProps["rowKey"];
};
export const selectionText = createContext<SelectionTextProps>({
  rowSelection: {},
  rowKey: () => "",
});

const Selection: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { selectedRowKeys, onSelectChange, rowKey } = useContext(pageContext);

  const rowSelection: TableRowSelection<Comment> = {
    selectedRowKeys,
    onSelect: onSelectChange,
    selections: false,
    fixed: true,
    hideSelectAll: true,
    columnWidth: 32,
  };
  return (
    <selectionText.Provider
      value={{
        rowSelection,
        rowKey,
      }}
    >
      {props?.children}
    </selectionText.Provider>
  );
};

export default memo(Selection);
