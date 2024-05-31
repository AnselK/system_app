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
  const startFilter = (dataarr, value:SearchValue) => {
    const regex = new RegExp(value.key_word.join("|"))
    const filterData = dataarr.reduce((prev, item: Video) => {
      const filterList = item.list.filter((vi) => {
        return handleFilter(vi,value,regex);
      });
      if (filterList && filterList.length > 0) {
        prev.push({ ...item, list: filterList });
      }
      return prev;
    }, [] as Video[]);
    setLoading(false);
    return filterData;
  };

  const handleFilter = (comment:Comment,search:SearchValue,regex:RegExp) =>{
    const hasKeyWord = regex.test(comment.comment_text)
    if(search.ip !== '全部'){
      return hasKeyWord && comment.ip_address === search.ip
    }
    return hasKeyWord;
  }

  const dataSource = useMemo(() => {
    if (data.length === 0) {
      return data;
    }
    setLoading(true);
    if (pageType === "card") {
      
      if (!filter?.key_word || filter?.key_word.length == 0) {
        return data;
      }
      return startFilter(data, filter);
    } else {
      const flat = () => {
        const flat_data = data.reduce((prev, item: Video) => {
          debugger
          if (!filter?.key_word || filter?.key_word.length == 0) {
            item.list && prev.push(...item.list);
          } else {
            const regex = new RegExp(filter.key_word.join("|"))
            const filterList =
              item.list &&
              item.list.filter((vi) => {
                return handleFilter(vi,filter,regex);
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
