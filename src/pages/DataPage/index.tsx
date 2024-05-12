import { Layout, message } from "antd";
import React, {
  useState,
  memo,
  createContext,
  useCallback,
  useEffect,
} from "react";
import Table from "./_components/Table";
import "./style.less";
import { stopQueryData } from "@src/services/data";
import useCircleFetch from "./hooks/useCircleFetch";
import Search from "./_components/Search";
import type { SearchProps } from "./_components/Search";
import type { SearchValue, Video } from "./type";
import to from "@src/common/requestUtils/to";
import { useLocation } from "react-router-dom";
const { Header, Content } = Layout;

export const pageContext = createContext({
  pause: async (status?: boolean) => true,
  searchLoading: false,
  pageType: "card",
  changePageType: (type) => {},
});

const DataPage = () => {
  const [dataSource, start, loading, pause] = useCircleFetch<Video>();
  const [filter, setFilter] = useState<SearchValue>();
  const location = useLocation();
  const [pageType, setPageType] = useState<string>("card");
  const { info, isHistory } = location.state || {};
  const stop = async (status: boolean = true) => {
    pause();
    const [_, error] = await to(stopQueryData);
    if (error) {
      message.error("服务器异常，请联系管理员!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isHistory) {
    } else {
      console.log(info, "ii");

      if (info) {
        start({ search_info: info });
      }
    }
    return () => {
      console.log("dddd");
      stop();
    };
  }, []);

  const onSearch: SearchProps["onSearch"] = useCallback(
    (val) => {
      setFilter(val);
    },
    [setFilter]
  );

  return (
    <div className="data-page">
      <pageContext.Provider
        value={{
          pause: stop,
          searchLoading: loading,
          pageType: pageType,
          changePageType: (type) => setPageType(type),
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
