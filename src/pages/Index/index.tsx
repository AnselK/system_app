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
  Space,
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
import MenuItem from './meunItem'
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

  useEffect(() => {
    console.log(current, "current");
  }, [current]);

  const deleteHistory = (id) => {
    Modal.confirm({
      title: "确认删除",
      content: "数据删除后无法恢复，是否确认删除？",
      async onOk() {
        
        const [_, error] = await to(deleteHistorySearch, id);
        if (error) {
          messageError("删除失败！");
          return Promise.resolve();
        }
        dispatch(deleteSearchHis(id));
        getHistoryData();
        if (id === selectedKeys[0]) {
          dispatch(changeSearch(null));
          setselectedKeys(["new_search"]);
          navigate("/search");
        }
        return Promise.resolve();
      },
    });
  };


  const newSearch = () => {
    navigate("/search");
  };

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider theme="light" style={{ padding: "16px"}} width={"12%"}>
        <Flex
          vertical
          justify="space-between"
          style={{ height: "100%" }}
          gap={12}
        >
          <Button type="default" onClick={newSearch} style={{marginRight:4,marginLeft:4}}>
            新搜索
          </Button>
          <Menu
            style={{ flex: 1, overflow: "auto" }}
            onClick={historySearch}
            
            selectedKeys={selectedKeys}
          >
            {
              hsitoryItems.map(item => (
                <MenuItem key={item.id} mem={item.comment_count} onDelete={deleteHistory} >{item.search}</MenuItem>
              ))
            }
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
