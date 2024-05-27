import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Layout,
  List,
  Menu,
  Progress,
  MenuProps,
  Dropdown,
  Modal,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  changeSearch,
  createSearch,
  deleteSearchHis,
  initSearchs,
} from "@src/store/search";
import { useDispatch } from "react-redux";
import MsgComponent from "./msgComponent";
import { deleteHistorySearch, getHistorySearch } from "@src/services/data";
import to from "@src/common/requestUtils/to";
import { useSelector } from "react-redux";
import { messageError } from "@src/common/messageUtil";
// import { Outlet, useNavigate } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];
const { Sider, Content } = Layout;
const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    navigate("/search");
  }, []);
  const hsitoryItems = useSelector((state: any) => state.main_data.history);
  const [selectedKeys, setselectedKeys] = useState<any[]>([]);
  const getHistoryData = async () => {
    const [data, _error] = await to<any[], any>(getHistorySearch);
    if (!_error && data) {
      dispatch(initSearchs(data));
    }
  };

  useEffect(() => {
    getHistoryData();
  }, []);

  const historySearch = ({ item, key, keyPath, domEvent }) => {
    setselectedKeys([key]);
    dispatch(changeSearch(key));
    navigate("/home");
  };

  const deleteHistory = (tar) => {
    Modal.confirm({
      title: "确认删除",
      content: "数据删除后无法恢复，是否确认删除？",
      async onOk() {
        getHistoryData();
        const [_, error] = await to(deleteHistorySearch, tar.id);
        if (error) {
          messageError("删除失败！");
          return Promise.resolve();
        }
        dispatch(deleteSearchHis(tar.id));
        if (tar.id === selectedKeys[0]) {
          dispatch(changeSearch(null));
          setselectedKeys(["new_search"]);
          navigate("/search");
        }
        return Promise.resolve();
      },
    });
  };

  const dropItems = (item): MenuProps["items"] => [
    {
      label: <span onClick={() => deleteHistory(item)}>删除</span>,
      danger: true,
      key: "delete",
    },
  ];

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider theme="light" style={{ padding: "16px" }}>
        <Menu
          onClick={historySearch}
          items={[
            {
              key: "new_search",
              label: "新搜索",
            },
            hsitoryItems.map((item) => ({
              ...item,
              icon: () => (
                <Dropdown menu={{ items: dropItems(item) }}></Dropdown>
              ),
            })),
          ]}
          selectedKeys={selectedKeys}
        >
          <Menu.Item></Menu.Item>
        </Menu>
        <Flex>
          <div className="left-operation"></div>
          <MsgComponent></MsgComponent>
        </Flex>
      </Sider>
      <Layout>
        <Content>
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(Index);
