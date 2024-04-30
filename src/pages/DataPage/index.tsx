import type { FormProps, TableProps } from "antd";
import React, { useState, memo, createContext } from "react";
import Filter from "./_components/Filter";
import Table from "./_components/Table";
import { searchProps } from "./type";
import "./style.less";
import { stopQueryData } from "@src/services/data";
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
  loading: false,
  pause: (status) => {},
  changeLoading: (type: boolean) => {},
  pauseStatus: false,
});

const DataPage = () => {
  const [search, setSearch] = useState<searchProps | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pauseStatus, setPauseStatus] = useState<boolean>(false);
  const onFinish = (values: searchProps) => {
    setSearch(values);
  };

  const stop = (status)=>{
    if(!status) return setPauseStatus(status)
    stopQueryData().then(res=>{
      setPauseStatus(status)
    })
  }

  return (
    <div className="data-page">
      <pageContext.Provider
        value={{
          loading,
          pauseStatus,
          changeLoading: (type: boolean) => setLoading(type),
          pause: stop,
        }}
      >
        <Filter onSearch={onFinish}></Filter>
        <Table search={search}></Table>
      </pageContext.Provider>
    </div>
  );
};

export default memo(DataPage);
