import { Button, Space, Input, Select } from "antd";
import type { ButtonProps, FormProps } from "antd";
import React, { memo, useContext } from "react";
import useInput from "../../hooks/useInput";
import "./index.less";
import { pageContext } from "../..";
interface user {
  uid: string;
  user_name: string;
  comment_time: string;
  comment_text: string;
  ip_address: string;
  homepage_link: string;
}

type select = Partial<Pick<user, "user_name" | "comment_time" | "ip_address">>;

interface search {
  search_content: string;
}

type sel = "select";

const Filter = ({ onSearch  }) => {
  const { loading,pause } = useContext(pageContext);
  const [Inputval, setSearchValue, Composition] = useInput<string>("");
  const [Selectval, setSelectValue] = useInput<String, sel>("user_name");
  const selectOptions = [
    { value: "user_name", label: "用户名称" },
    { value: "comment_text", label: "评论内容" },
    { value: "ip_address", label: "ip" },
  ];
  const onFinish: ButtonProps["onClick"] = () => {
    if (!Inputval.trim()) return;
    pause(false)
    onSearch({
      searchCol: Selectval,
      search_info: Inputval,
    });
  };

  const onPause = () => {
    if (!loading) return;
    pause(true);
  };

  return (
    <div className="filter-form">
      <Space size="large">
        <Space.Compact>
          <Select
            options={selectOptions}
            value={Selectval}
            onChange={setSelectValue}
          ></Select>
          <Input
            value={Inputval}
            onChange={setSearchValue}
            onCompositionEnd={Composition}
            onCompositionStart={Composition}
            onCompositionUpdate={Composition}
          ></Input>
        </Space.Compact>
        <Button type="primary" onClick={onFinish} disabled={loading}>
          搜索
        </Button>
        <Button type="primary" onClick={onPause} disabled={!loading}>
          停止
        </Button>
      </Space>
    </div>
  );
};

export default memo(Filter);
