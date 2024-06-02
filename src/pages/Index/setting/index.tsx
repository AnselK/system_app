import { SettingFilled } from "@ant-design/icons";
import useLoading from "@src/hooks/useLoading";
import { updateSetting } from "@src/services/setting";
import { asyncConfigChunk } from "@src/store/users";
import { Button, Form, InputNumber, Popover, Switch } from "antd";
import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";

const valEnum = {
  auto_save_data: "save_followed_data",
  save_followed_data: "auto_save_data",
};

const Setting = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // @ts-ignore
  const [submit, loading] = useLoading<any>(updateSetting);
  const onFormChange = useCallback(
    (values, allValus) => {
      if (!("data_storage_day" in values)) {
        const key = Object.keys(values)[0];
        form.setFieldValue(valEnum[key], !values[key]);
      }
    },
    [form]
  );
  const submitSetting = useCallback(
    (values) => {
      const data = { ...values };
      Object.keys(valEnum).forEach((key) => {
        data[key] = Number(data[key]);
      });
      submit(data).then((res) => {
        // @ts-ignore
        dispatch(asyncConfigChunk());
      });
    },
    [form]
  );
  return (
    <Form onValuesChange={onFormChange} form={form} onFinish={submitSetting}>
      <Form.Item
        label="数据保存天数"
        name={"data_storage_day"}
        initialValue={7}
      >
        <InputNumber></InputNumber>
      </Form.Item>
      <Form.Item
        label="搜索时自动保存"
        name={"auto_save_data"}
        initialValue={false}
      >
        <Switch></Switch>
      </Form.Item>
      <Form.Item
        label="只保存关注/私信的数据"
        name={"save_followed_data"}
        initialValue={true}
      >
        <Switch></Switch>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" size="small" loading={loading}>
          提交修改
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(Setting);
