import { Layout } from "antd";
import React, { useState, memo, createContext } from "react";
import Table from "./_components/Table";
import "./style.less";
import { stopQueryData } from "@src/services/data";
import useCircleFetch from "./hooks/useCircleFetch";
import Search from "./_components/Search";
import type { SearchProps } from "./_components/Search";
import type { SearchValue, Video } from "./type";
const { Header, Content } = Layout;

export const pageContext = createContext({
  pause: (status) => {},
  searchLoading: false,
});

const DataPage = () => {
  const [dataSource, start, loading, pause] = useCircleFetch<Video>();
  const [filter, setFilter] = useState<SearchValue>();

  const stop = (status) => {
    if (!status) return pause();
    stopQueryData().then((res) => {
      pause();
    });
  };

  const onSearch: SearchProps["onSearch"] = (val) => {
    if (val.isSearch) {
      if (!val.search_info?.trim()) return;
      start(val);
      setFilter(undefined);
      return;
    }
    setFilter(val);
  };

  return (
    <div className="data-page">
      <pageContext.Provider
        value={{
          pause: stop,
          searchLoading: loading,
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
