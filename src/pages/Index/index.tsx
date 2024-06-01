import React, { memo, useEffect } from "react";
import { Button, Flex, Layout, Row, Col, Popover } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { initSearchs } from "@src/store/search";
import { useDispatch } from "react-redux";
import MsgComponent from "./msgComponent";
import { getHistorySearch } from "@src/services/data";
import to from "@src/common/requestUtils/to";
import { SettingFilled } from "@ant-design/icons";
import Setting from "./setting";
import { asyncConfigChunk } from "@src/store/users";
import "./style.less";
import HistoryMenu from "./HistoryMenu";
// import { Outlet, useNavigate } from "react-router-dom";
const { Sider, Content } = Layout;
const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    navigate("/search");
  }, []);

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

 
  const newSearch = () => {
    navigate("/search");
  };

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider theme="light" style={{ padding: "16px" }} width={"12%"}>
        <Flex
          vertical
          justify="space-between"
          style={{ height: "100%" }}
          gap={12}
        >
          <Button
            type="default"
            onClick={newSearch}
            style={{ marginRight: 4, marginLeft: 4 }}
          >
            新搜索
          </Button>
          <HistoryMenu />

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
