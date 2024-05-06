import type { FormProps, TableProps } from "antd";
import React, { useState, memo, createContext } from "react";
import Filter from "./_components/Filter";
import Table from "./_components/Table";
import { searchProps } from "./type";
import "./style.less";
import { stopQueryData } from "@src/services/data";
import useCircleFetch from "./hooks/useCircleFetch";
interface user {
  uid: string;
  user_name: string;
  comment_time: string;
  comment_text: string;
  ip_address: string;
  homepage_link: string;
}

type select = Partial<Pick<user, "user_name" | "comment_time" | "ip_address">>;
export const pageContext = createContext({
  pause: (status) => {},
  searchLoading:false
});

const DataPage = () => {
  const [dataSource, start, loading, pause] = useCircleFetch<Array<user>>();
  const onFinish = (values: searchProps) => {
    if(!values.search_info.trim())return
    console.log(values,'vvv');
    
    start(values)
  };

  const stop = (status)=>{
    if(!status) return pause()
    stopQueryData().then(res=>{
      pause()
    })
  }

  return (
    <div className="data-page">
      <pageContext.Provider
        value={{
          pause: stop,
          searchLoading:loading
        }}
      >
        <Filter onSearch={onFinish}></Filter>
        <Table data={dataSource!}></Table>
      </pageContext.Provider>
    </div>
  );
};

export default memo(DataPage);
