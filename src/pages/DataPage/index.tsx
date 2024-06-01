import { Layout, message, TableProps } from "antd";
import React, {
  useState,
  memo,
  createContext,
  useCallback,
  useEffect,
  useRef,
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
import useFetch from "./hooks/useFetch";
import search from "@src/store/search";
import { TableRowSelection } from "antd/es/table/interface";
const { Header, Content } = Layout;
const messageCount = 20;
type PageContextProps = {
  pause: (status?: boolean) => Promise<boolean>;
  searchLoading: boolean;
  pageType: string;
  changePageType: (type: string) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: TableRowSelection<any>["onSelect"];
  rowKey: TableProps["rowKey"];
  clearSelectKeys: () => void;
  selectRowMap?: React.MutableRefObject<Map<React.Key, Comment>>;
  changeFollowStateAndClear: (data: Video[]) => void;
};

export const pageContext = createContext<PageContextProps>({
  pause: async (status?: boolean) => true,
  searchLoading: false,
  pageType: "card",
  changePageType: (type) => {},
  selectedRowKeys: [],
  onSelectChange: (...args) => {},
  rowKey: () => "",
  clearSelectKeys: () => {},
  changeFollowStateAndClear: (data: Video[]) => {},
});

const DataPage = () => {
  const [filter, setFilter] = useState<SearchValue>();
  const location = useLocation();
  const current: SearchsItemType = useSelector(
    (state: any) => state.main_data.current
  );
  const current_id: SearchsItemType = useSelector(
    (state: any) => state.main_data.current_id
  );
  const [start, pause] = useCircleFetch<Video>();
  const [pageType, setPageType] = useState<string>("card");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const messageRowMap = useRef(new Map<React.Key, Comment>());
  const rowKey = (record: Comment) => `${record.id}${record.uid}`;
  const onSelectChange = (record, selected, selectedRows, nativeEvent) => {
    // if (
    //   selectedRowKeys.length > messageCount ||
    //   selectedRows.length + selectedRows.length > messageCount
    // )
    //   return messageError(`一次只能选择${messageCount}条数据，请重新选择`);
    setSelectedRowKeys((prev: React.Key[]) => {
      const row_key = rowKey(record);
      if (!selected) {
        messageRowMap.current.delete(row_key);
        const filters = prev.filter((item) => item !== row_key);
        return [...filters];
      }
      const video = current.list?.find((e) => e.video_id === record.video_id);

      messageRowMap.current.set(row_key, {
        ...record,
        video_info: {
          title: video?.title,
          author_name: video?.author_name,
          video_id: video?.video_id,
          video_publish_time: video?.video_publish_time,
          duration: video?.duration,
          collect_count: video?.collect_count,
          comment_count: video?.comment_count,
          digg_count: video?.digg_count,
          share_count: video?.share_count,
          search_id: current.id,
        },
      });

      prev.push(row_key);
      return [...prev];
    });
  };
  const stop = async (status: boolean = true) => {
    if (current?.loading) {
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
    if (current_id) {
      start(current);
    }
  }, [current_id]);

  const onSearch: SearchProps["onSearch"] = useCallback(
    (val) => {
      setFilter(val);
    },
    [setFilter]
  );

  const clearSelectKeys = () => {
    setSelectedRowKeys([]);
    messageRowMap.current.clear();
  };

  const changeFollowStateAndClear = (dataSource) => {
    selectedRowKeys.forEach((key) =>
      dataSource.forEach((data) =>
        data.list.forEach((cmt) => {
          if (rowKey(cmt) === key) {
            cmt.has_letter = 1;
          }
        })
      )
    );
    clearSelectKeys();
  };

  return (
    <div className="data-page">
      <pageContext.Provider
        value={{
          pause: stop,
          searchLoading: current?.loading ?? true,
          pageType: pageType,
          changePageType: (type) => setPageType(type),
          selectedRowKeys,
          onSelectChange,
          rowKey,
          clearSelectKeys,
          selectRowMap: messageRowMap,
          changeFollowStateAndClear,
        }}
      >
        <Layout style={{ height: "100%" }}>
          <Header style={{ padding: 0, background: "#fff" }}>
            <Search onSearch={onSearch}></Search>
          </Header>
          <Content>
            <Table data={current?.list ?? []} filter={filter}></Table>
          </Content>
        </Layout>
      </pageContext.Provider>
    </div>
  );
};

export default memo(DataPage);
