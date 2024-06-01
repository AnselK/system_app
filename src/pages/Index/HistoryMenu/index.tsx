import React, { memo, useEffect, useState } from "react";
import { Menu, Button, Modal, Tooltip } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { changeSearch, deleteSearchHis, initSearchs } from "@src/store/search";
import { useDispatch } from "react-redux";
import { deleteHistorySearch, getHistorySearch } from "@src/services/data";
import to from "@src/common/requestUtils/to";
import { useSelector } from "react-redux";
import { messageError } from "@src/common/messageUtil";
import { asyncConfigChunk } from "@src/store/users";
import { useLocation, useNavigate } from "react-router-dom";
const HistoryMenu = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    navigate("/search");
  }, []);
  const location = useLocation();
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

  const deleteHistory = (e, id) => {
    e.stopPropagation();
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

  useEffect(() => {
    if (location.pathname !== "/home" && selectedKeys.length !== 0) {
      setselectedKeys([]);
      dispatch(changeSearch(null));
    }
  }, [location]);

  return (
    <Menu
      style={{ flex: 1, overflow: "auto" }}
      onClick={historySearch}
      selectedKeys={selectedKeys}
    >
      {hsitoryItems.map((item) => (
        <Menu.Item key={item.id}>
          <div className="menu-item-content">
            <Tooltip
              placement="right"
              title={`占用内存:【${item.comment_count}M】标题:【${item.search}】`}
            >
              <span
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  display: "inline-block",
                  maxWidth: "90%",
                }}
              >
                {item.search}
              </span>
            </Tooltip>
            <Button
              onClick={(e) => deleteHistory(e, "")}
              className="menu-item-del"
              type="text"
              size="small"
              style={{ position: "absolute", right: 10, marginTop: 10 }}
            >
              <DeleteFilled />
            </Button>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default memo(HistoryMenu);
