import { Empty, Spin, Table } from "antd";
import React, { memo, useContext, useEffect, useState } from "react";
import type { SearchValue, Video, Comment } from "../../type";
import { pageContext } from "../..";
import { debounce } from "@src/common/functionUtils";
import Card, { columns } from "./Card";

type propsType = {
  data: Video[];
  filter?: SearchValue;
};

const TableC: React.FC<propsType> = (props) => {
  const { data, filter } = props;
  const [dataSource, setdDataSource] = useState<Video[] | Comment[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { searchLoading, pageType } = useContext(pageContext);

  const onFilter = debounce((value: SearchValue) => {
    setLoading(true);
    if (data.length === 0) return;
    if (!value.search_info.trim()) return setdDataSource(data);

    const startFilter = () => {
      const filterData = data.reduce((prev, item: Video) => {
        const filterList = item.list.filter((vi) => {
          const key = value.key_word;
          return vi[key].indexOf(value.search_info) > -1;
        });
        if (pageType === "card") {
          if (filterList && filterList.length > 0) {
            // @ts-ignore
            prev.push({ ...item, list: filterList });
          }
        } else {
          // @ts-ignore
          prev.push(...filterList);
        }
        return prev;
      }, [] as Video[] | Comment[]);
      setdDataSource(filterData);
      setLoading(false);
    };
    requestIdleCallback(startFilter, { timeout: 1000 });
  }, 64);

  const setDataByType = () => {
    if (pageType === "card") {
      setdDataSource(data);
    } else {
      const flat_data = data.reduce((prev, item: Video) => {
        prev.push(...item.list);
        return prev;
      }, [] as Comment[]);
      setdDataSource(flat_data);
    }
  };

  useEffect(() => {
    if (filter) {
      onFilter(filter);
      return;
    }
    setDataByType();
  }, [data, filter, pageType]);

  const tableListComponent = (
    <Table
      columns={columns}
      dataSource={dataSource as Comment[]}
      className="list-table"
      scroll={{ y: 700 }}
    ></Table>
  );

  const tableCardComponent = (
    <>
      {dataSource?.map((item, index) => (
        <Card data={item} dataSource={item.list} key={item.video_id}></Card>
      ))}
    </>
  );

  return (
    <div className="table-page">
      {dataSource?.length === 0 ? (
        searchLoading ? (
          <Spin
            spinning={dataSource?.length === 0}
            tip="正在努力加载中..."
            style={{ height: "100%", width: "100%" }}
          ></Spin>
        ) : (
          <Empty style={{ height: "100%" }}></Empty>
        )
      ) : (
        <div className="table-page-container">
          {pageType === "card" ? tableCardComponent : tableListComponent}
        </div>
      )}
    </div>
  );
};

export default memo(TableC);
