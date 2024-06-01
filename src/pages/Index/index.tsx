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
  Row,
  Col,
  Popover,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { changeSearch, deleteSearchHis, initSearchs } from "@src/store/search";
import { useDispatch } from "react-redux";
import MsgComponent from "./msgComponent";
import { deleteHistorySearch, getHistorySearch } from "@src/services/data";
import to from "@src/common/requestUtils/to";
import { useSelector } from "react-redux";
import { messageError } from "@src/common/messageUtil";
import { SettingFilled } from "@ant-design/icons";
import Setting from "./setting";
import { asyncConfigChunk } from "@src/store/users";
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
  const current = useSelector((state: any) => state.main_data.current);
  const [selectedKeys, setselectedKeys] = useState<any[]>([]);
  const getHistoryData = async () => {
    const [data, _error] = await to<any[], any>(getHistorySearch);
    if (!_error && data) {
      dispatch(initSearchs(data));
    }
  };

  useEffect(() => {
    getHistoryData();
    // @ts-ignore
    dispatch(asyncConfigChunk());
  }, []);

  const historySearch = ({ item, key, keyPath, domEvent }) => {
    setselectedKeys([key]);
    dispatch(changeSearch(key));
    setTimeout(() => {
      navigate("/home");
    });
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

  const newSearch = () => {
    navigate("/search");
  };

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider theme="light" style={{ padding: "16px" }}>
        <Flex
          vertical
          justify="space-between"
          style={{ height: "100%" }}
          gap={12}
        >
          <Button type="primary" onClick={newSearch}>
            新搜索
          </Button>
          <Menu
            style={{ flex: 1, overflow: "auto" }}
            onClick={historySearch}
            items={hsitoryItems.map((item) => ({
              label: item.search,
              key: item.id,
              icon: () => (
                <Dropdown menu={{ items: dropItems(item) }}>ddd</Dropdown>
              ),
            }))}
            selectedKeys={selectedKeys}
          >
            <Menu.Item></Menu.Item>
          </Menu>
          <Row>
            <Col span={4}>
              <Popover
                content={<Setting />}
                trigger={"click"}
                placement="topLeft"
              >
                <SettingFilled />
              </Popover>
            </Col>
            <Col span={18} offset={2}>
              <MsgComponent></MsgComponent>
            </Col>
          </Row>
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
