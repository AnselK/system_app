import { Button, Flex, Form, FormProps, Input, Layout, Space } from "antd";
import React, { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";

const SearchIndex = () => {
  const navigate = useNavigate();
  const onFinish: FormProps["onFinish"] = (value) => {
    if (!value.search_info.trim()) return;
    navigate("/home", { state: { info: value.search_info, isHistory: false } });
  };

  return (
    <Layout.Content style={{ height: "100%" }} className="search-index-layout">
      <div className="search-index">
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Form onFinish={onFinish} style={{ width: "50%" }}>
            <Form.Item name={"search_info"}>
              <Input
                size="large"
                style={{ width: "100%" }}
                suffix={
                  <Button type="primary" htmlType="submit">
                    开始
                  </Button>
                }
              ></Input>
            </Form.Item>
          </Form>
        </Flex>
      </div>
    </Layout.Content>
  );
};

export default memo(SearchIndex);
