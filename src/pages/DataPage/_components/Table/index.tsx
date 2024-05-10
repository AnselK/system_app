import { Spin, Table } from "antd";
import type { TableProps } from "antd";
import React, { memo, useContext, useEffect, useState } from "react";
import "./index.less";
import type { SearchValue, Comment, Video } from "../../type";
import { pageContext } from "../..";
import { debounce } from "@src/common/functionUtils";
import Card from "./Card";

type propsType = {
  data: Video[];
  filter?: SearchValue;
};

const TableC: React.FC<propsType> = (props) => {
  const { data, filter } = props;
  const [dataSource, setdDataSource] = useState<Video[]>();
  const [loading, setLoading] = useState<boolean>();
  const { searchLoading } = useContext(pageContext);

  const getTime = (time: any) => {
    return new Date(time).getTime();
  };

  const onFilter = debounce((value: SearchValue) => {
    setLoading(true);
    if (data.length === 0) return;
    if (!value.search_info.trim()) return setdDataSource(data);
    const filterData = data.filter((item: Video) => {
      const key = value.key_word;
      return item[key].indexOf(value.search_info) > -1;
    });
    setdDataSource(filterData);
    setLoading(false);
  }, 64);

  useEffect(() => {
    if (filter) {
      onFilter(filter);
      return;
    }
    setdDataSource(data);
  }, [data, filter]);

  return (
    <div className="table-page">
      <Spin
        tip="loading..."
        spinning={!dataSource || dataSource?.length === 0}
        style={{ height: "100%" }}
      >
        <div>ssss</div>
        {dataSource?.map((item) => (
          <Card data={item}></Card>
        ))}
      </Spin>
    </div>
  );
};

export default memo(TableC);
