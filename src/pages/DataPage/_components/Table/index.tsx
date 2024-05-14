import { Empty, Spin, Table } from "antd";
import React, { memo, useContext, useMemo, useState } from "react";
import type { SearchValue, Video, Comment } from "../../type";
import { pageContext } from "../..";
import Card, { columns } from "./Card";
import { TableRowSelection } from "antd/es/table/interface";
import Selection from "./Selection";
import TableList from "./TableList";
import CardList from "./CardList";

type propsType = {
  data: Video[];
  filter?: SearchValue;
};

const TableC: React.FC<propsType> = (props) => {
  const { data, filter } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { searchLoading, pageType } = useContext(pageContext);
  const startFilter = (dataarr, value) => {
    const filterData = dataarr.reduce((prev, item: Video) => {
      const filterList = item.list.filter((vi) => {
        const key = value.key_word;
        return vi[key].indexOf(value.search_info) > -1;
      });
      if (filterList && filterList.length > 0) {
        prev.push({ ...item, list: filterList });
      }
      return prev;
    }, [] as Video[]);
    setLoading(false);
    return filterData;
  };

  const dataSource = useMemo(() => {
    if (data.length === 0) {
      return data;
    }
    setLoading(true);
    if (pageType === "card") {
      if (!filter?.search_info.trim()) {
        return data;
      }
      return startFilter(data, filter);
    } else {
      const flat = () => {
        const flat_data = data.reduce((prev, item: Video) => {
          if (!filter?.search_info.trim()) {
            item.list && prev.push(...item.list);
          } else {
            const filterList =
              item.list &&
              item.list.filter((vi) => {
                const key = filter.key_word;
                return vi[key].indexOf(filter.search_info) > -1;
              });
            prev.push(...filterList);
          }
          return prev;
        }, [] as Comment[]);
        setLoading(false);
        return flat_data;
      };

      return flat();
    }
  }, [data, pageType, filter]);

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
          <Selection>
            {pageType === "card" ? (
              <CardList dataSource={dataSource}></CardList>
            ) : (
              <TableList dataSource={dataSource} loading={loading}></TableList>
            )}
          </Selection>
        </div>
      )}
    </div>
  );
};

export default memo(TableC);
