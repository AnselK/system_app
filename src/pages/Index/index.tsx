import React, { memo, useEffect } from "react";
import { Button, Layout, List } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
// import { Outlet, useNavigate } from "react-router-dom";
const { Sider, Content } = Layout;
const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/search");
  }, []);
  const search = ["医美"];
  const renderItem = (item) => {
    return (
      <List.Item>
        <div>搜索历史{item}</div>
      </List.Item>
    );
  };
  const listHeader = (
    <div>
      <Button
        onClick={() => {
          navigate("/search");
        }}
      >
        新增搜索
      </Button>
    </div>
  );
  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <Sider theme="light" style={{ padding: "16px" }}>
        <List
          header={listHeader}
          renderItem={renderItem}
          dataSource={search}
        ></List>
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
