import {
  Badge,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Divider,
} from "antd";

import { DeleteFilled } from "@ant-design/icons";
import React, { memo, useCallback, useContext, useState, useRef } from "react";

import type { SearchValue } from "../../type";
import { pageContext } from "../..";
import { debounce } from "@src/common/functionUtils";
import { messageError } from "@src/common/messageUtil";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addMsg } from "@src/store/message";
import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MessageModal from "./messageModal";
import PageType from "./PageType";
import { selectOptions } from "./config/area";

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const setSearchHistory = debounce((data) => {
  localStorage.setItem("keywords", JSON.stringify(data));
}, 64);

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { pause, selectedRowKeys, selectRowMap } = useContext(pageContext);
  const curreent = useSelector((state: any) => state.main_data.current);
  const [pauseLoading, setPauseLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onFinish = useCallback(
    (value) => {
      const data = form.getFieldsValue();
      if (!data.ip) {
        data.ip = "全部";
      }
      onSearch({ isSearch: false, ...data });
    },
    [onSearch]
  );

  const onResetSearch = useCallback(
    (value) => {
      const data = form.getFieldsValue();
      if (!data.key_word || data.key_word.length === 0) {
        return;
      }
      form.resetFields();
      form.setFieldValue("ip", "全部");
      data.ip = "全部";
      data.key_word = [];
      onSearch({ isSearch: false, ...data });
    },
    [onSearch]
  );

  const pauseSearch = useCallback(async () => {
    setPauseLoading(true);
    await pause();
    setPauseLoading(false);
  }, [onSearch]);

  const [items, setItems] = useState(["多少钱"]);
  const [name, setName] = useState("");
  const [selectKeys, setSelectKeys] = useState<any>([]);
  const keyWordRef = useRef<InputRef>(null);

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (!name) {
      return;
    }
    const arr = [...items, name];
    setItems(arr);
    setSearchHistory(arr);

    setTimeout(() => {
      keyWordRef.current?.focus();
      setName("");
    }, 0);
  };

  const onDeleteSelectItem = (e, item) => {
    e.stopPropagation();
    const arr = items.filter((e) => e !== item);
    setItems(arr);
    setSearchHistory(arr);
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [modalForm] = Form.useForm();
  const sendMessageModal = () => {
    const messageComponent = (
      <Form form={modalForm}>
        <Form.Item name={"message"}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    );
    const modal = Modal.info({
      icon: "",
      title: "私信内容",
      content: messageComponent,
      onOk() {
        const { message } = modalForm.getFieldsValue();
        if (!message.trim()) {
          messageError("请输入私信内容!");
          return Promise.reject();
        }
        // startSend({
        //   msg: message,
        //   homepage_links: [...selectRowMap?.current.values()!],
        // });
        dispatch(
          addMsg({
            msg: message,
            links: [...selectRowMap?.current.values()!],
          })
        );

        return Promise.resolve();
      },
    });
  };

  return (
    <div className="search-box">
      <Form<SearchValue> form={form} className="search-form-container">
        <Space
          style={{ width: "100%", justifyContent: "center", padding: 16 }}
          size={"large"}
        >
          <Form.Item name="ip" label="IP地址">
            <Select
              options={selectOptions}
              style={{ width: "100%" }}
              defaultValue={"全部"}
            ></Select>
          </Form.Item>
          <Form.Item name="key_word" label="评论关键词">
            {/* <Input placeholder="多个关键词以竖线 “|” 隔开"/> */}
            <Select
              mode="tags"
              style={{ width: 300 }}
              placeholder="请选择关键词"
              value={selectKeys}
              onChange={setSelectKeys}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ marginRight: 20 }}>
                    <Input
                      placeholder=""
                      ref={keyWordRef}
                      value={name}
                      onChange={onNameChange}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addItem}
                    >
                      添加关键词
                    </Button>
                  </Space>
                </>
              )}
              options={items.map((item, idx) => ({
                label: (
                  <>
                    <span className="search-history-item">
                      {item}
                      <DeleteFilled
                        className="option-delete-icon"
                        onClick={(e) => onDeleteSelectItem(e, item)}
                        style={{}}
                      />
                    </span>
                  </>
                ),
                value: item,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button onClick={onFinish}>搜索</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={onResetSearch}>重置</Button>
          </Form.Item>
          <Form.Item>
            <Space>
              {curreent?.crawered ? (
                ""
              ) : (
                <Button danger onClick={pauseSearch} loading={pauseLoading}>
                  停止爬取
                </Button>
              )}
              {/* <Button onClick={resSearch}>重新搜索</Button> */}
              <MessageModal searchId={curreent?.id}></MessageModal>
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <PageType />
    </div>
  );
};

export default memo(Search);
