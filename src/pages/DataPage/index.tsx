import { Layout, message, TableProps } from "antd";
import React, {
  useState,
  memo,
  createContext,
  useCallback,
  useEffect,
  ReducerState,
} from "react";
import Table from "./_components/Table";
import "./style.less";
import { stopQueryData } from "@src/services/data";
import useCircleFetch from "./hooks/useCircleFetch";
import Search from "./_components/Search";
import type { SearchProps } from "./_components/Search";
import type { SearchValue, Video, Comment } from "./type";
import to from "@src/common/requestUtils/to";
import { useLocation } from "react-router-dom";
import { messageError } from "@src/common/messageUtil";
import { useSelector } from "react-redux";
import { SearchsItemType } from "@src/store/search/interface";
import search from "@src/store/search";
const { Header, Content } = Layout;
const messageCount = 20;
type PageContextProps = {
  pause: (status?: boolean) => Promise<boolean>;
  searchLoading: boolean;
  pageType: string;
  changePageType: (type: string) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (record, selected, selectedRows, nativeEvent) => void;
  rowKey: TableProps["rowKey"];
  clearSelectKeys: () => void;
  selectRowMap?: Map<React.Key, Comment>;
  changeFollowStateAndClear:() => void;
};

export const pageContext = createContext<PageContextProps>({
  pause: async (status?: boolean) => true,
  searchLoading: false,
  pageType: "card",
  changePageType: (type) => {},
  selectedRowKeys: [],
  onSelectChange: (record, selected, selectedRows, nativeEvent) => {},
  rowKey: () => "",
  clearSelectKeys: () => {},
  selectRowMap:new Map(),
  changeFollowStateAndClear: () =>{}
});

const DataPage = () => {
  const [filter, setFilter] = useState<SearchValue>();
  const location = useLocation();
  const current: SearchsItemType = useSelector(
    (state: any) => state.main_data.current
  );
  // const current = {};
  const [dataSource, start, sealoading, pause] = useCircleFetch<Video>();
  const [pageType, setPageType] = useState<string>("card");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [messageRowMap,setMessageRowMap] = useState(new Map<React.Key, Comment>())
  const rowKey = (record: Comment) => `${record.id}${record.uid}`;
  const onSelectChange = (record, selected, selectedRows, nativeEvent) => {
    
    if (
      selectedRowKeys.length > messageCount ||
      selectedRows.length + selectedRows.length > messageCount
    )
      return messageError(`一次只能选择${messageCount}条数据，请重新选择`);
    setSelectedRowKeys((prev: React.Key[]) => {
      const row_key = rowKey(record);
      if (!selected) {
        setMessageRowMap(preMap => {
          const newMap = new Map(preMap);
          newMap.delete(row_key);
          return newMap;
        })
        const filters = prev.filter((item) => item !== row_key);
        return [...filters];
      }
      const video = dataSource.find(e => e.video_id === record.video_id)
      console.log("current",current)
      setMessageRowMap(prevMap => new Map(prevMap).set(row_key,
        {...record,
        video_info:{
          title:video?.title,
          author_name:video?.author_name,
          video_id: video?.video_id,
          video_publish_time: video?.video_publish_time,
          duration: video?.duration,
          collect_count: video?.collect_count,
          comment_count: video?.comment_count,
          digg_count: video?.digg_count,
          share_count: video?.share_count,
          search_id : current.id
        }}))
      
      prev.push(row_key);
      return [...prev];
    });
  };
  const stop = async (status: boolean = true) => {
    if (sealoading) {
      pause();
      const [_, error] = await to(stopQueryData);
      if (error) {
        message.error("服务器异常，请联系管理员!");
        return false;
      }
      return true;
    }
    return true;
  };

  useEffect(() => {
    // if (current?.isHistory) {
    // } else {
    // }

    // start({ search_info: current.keyword, isHistory:current.isHistory });
    if (current) {
      start(current);
    }
    // return () => {
    //   // if (!current.isHistory) {
    //   //   // stFop();
    //   // }
    // };
  }, [current]);

  const onSearch: SearchProps["onSearch"] = useCallback(
    (val) => {
      setFilter(val);
    },
    [setFilter]
  );

  const clearSelectKeys = () => {
    setSelectedRowKeys([]);
    setMessageRowMap(new Map())
  };

  const changeFollowStateAndClear = () => {
    selectedRowKeys.forEach(key => 
      dataSource.forEach(data => 
        data.list.forEach(cmt => {
      if(rowKey(cmt) === key){
        cmt.has_letter = 1;
      }
    })))
    clearSelectKeys()
    
  }

  return (
    <div className="data-page">
      <pageContext.Provider
        value={{
          pause: stop,
          searchLoading: sealoading,
          pageType: pageType,
          changePageType: (type) => setPageType(type),
          selectedRowKeys,
          onSelectChange,
          rowKey,
          clearSelectKeys,
          selectRowMap: messageRowMap,
          changeFollowStateAndClear
        }}
      >
        <Layout style={{ height: "100%" }}>
          <Header style={{ padding: 0, background: "#fff" }}>
            <Search onSearch={onSearch}></Search>
          </Header>
          <Content>
            <Table data={dataSource!} filter={filter}></Table>
          </Content>
        </Layout>
      </pageContext.Provider>
    </div>
  );
};

export default memo(DataPage);
