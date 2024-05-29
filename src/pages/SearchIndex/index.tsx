import {
  Button,
  Dropdown,
  Flex,
  Form,
  FormProps,
  Input,
  Layout,
  Radio,
  Space,
} from "antd";
import React, { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { createSearch } from "@src/store/search";
import { useDispatch } from "react-redux";
import { DownOutlined } from "@ant-design/icons";

const SearchIndex = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onFinish: FormProps["onFinish"] = (value) => {
    if (!value.search_info.trim()) return;
    const search_params = form.getFieldsValue();
    dispatch(
      createSearch({
        isHistory: false,
        search: value.search_info,
        search_params: { ...search_params },
      })
    );
    navigate("/home", { state: { info: value.search_info, isHistory: false } });
  };

  const dropdownRender = () => {
    return (
      <Form layout="vertical" form={form}>
        <Form.Item name={"sort_type"} label="排序依据" initialValue={0}>
          <Radio.Group className="sort-item-group">
            <Space>
              <Radio.Button value={0}>综合排序</Radio.Button>
              <Radio.Button value={1}>最新发布</Radio.Button>
              <Radio.Button value={2}>最多点赞</Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={"发布时间"} name={"publish_time"} initialValue={0}>
          <Radio.Group className="sort-item-group">
            <Space>
              <Radio.Button value={0}>不限</Radio.Button>
              <Radio.Button value={1}>一天内</Radio.Button>
              <Radio.Button value={2}>一周内</Radio.Button>
              <Radio.Button value={3}>半年内</Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={"视频时长"} name={"filter_duration"} initialValue={0}>
          <Radio.Group className="sort-item-group">
            <Space>
              <Radio.Button value={0}>不限</Radio.Button>
              <Radio.Button value={1}>一分钟以下</Radio.Button>
              <Radio.Button value={2}>1-5分钟</Radio.Button>
              <Radio.Button value={3}>5分钟以上</Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={"搜索范围"} initialValue={0} name={"search_range"}>
          <Radio.Group className="sort-item-group">
            <Space>
              <Radio.Button value={0}>不限</Radio.Button>
              <Radio.Button value={1}>关注的人</Radio.Button>
              <Radio.Button value={2}>最近看过</Radio.Button>
              <Radio.Button value={3}>还未看过</Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
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
                prefix={
                  <Dropdown
                    dropdownRender={dropdownRender}
                    overlayClassName="search-filter-drop"
                  >
                    <Space>
                      排序筛选
                      <DownOutlined />
                    </Space>
                  </Dropdown>
                }
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
