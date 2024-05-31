import {
  Badge,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Divider
} from "antd";

import { DeleteFilled } from "@ant-design/icons";
import React, { memo, useCallback, useContext, useState,useRef, useEffect } from "react";
import {
  SearchOutlined,
  CreditCardOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import type { SearchValue } from "../../type";
import { useNavigate } from "react-router-dom";
import { pageContext } from "../..";
import { debounce } from "@src/common/functionUtils";
import { messageError, messageSuccess } from "@src/common/messageUtil";
import { sendMessage } from "@src/services/data";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import type { InputRef } from 'antd';


import {PlusOutlined} from"@ant-design/icons";
import DynamicTextAreaForm from "./dynamicTextAreaForm";
import MessageModal from "./messageModal";


const selectOptions = [
  { value: "全部", label: "全部" },{ value: "四川", label: "四川" },{ value: "重庆", label: "重庆" },{ value: "北京", label: "北京" },
  { value: "上海", label: "上海" },{ value: "广东", label: "广东" },
  { value: "河北", label: "河北" },{ value: "山西", label: "山西" },{ value: "辽宁", label: "辽宁" },{ value: "吉林", label: "吉林" },
  { value: "黑龙江", label: "黑龙江" },{ value: "江苏", label: "江苏" },{ value: "浙江", label: "浙江" },{ value: "安徽", label: "安徽" },
  { value: "福建", label: "福建" },{ value: "江西", label: "江西" },{ value: "山东", label: "山东" },
  { value: "河南", label: "河南" },{ value: "湖北", label: "湖北" },{ value: "湖南", label: "湖南" },
  { value: "海南", label: "海南" },
  { value: "贵州", label: "贵州" },{ value: "云南", label: "云南" },{ value: "陕西", label: "陕西" },
  { value: "甘肃", label: "甘肃" },{ value: "青海", label: "青海" },
  { value: "内蒙古", label: "内蒙古" },{ value: "广西", label: "广西" },{ value: "西藏", label: "西藏" },
  { value: "宁夏", label: "宁夏" },{ value: "新疆", label: "新疆" },
  { value: "天津", label: "天津" },
  { value: "香港", label: "香港" },{ value: "澳门", label: "澳门" },{ value: "台湾", label: "台湾" },
];

export interface SearchProps {
  onSearch: (values: SearchValue & { isSearch: boolean }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { pause, pageType, changePageType, selectedRowKeys, selectRowMap,changeFollowStateAndClear } =
    useContext(pageContext);
  const curreent = useSelector((state: any) => state.main_data.current);
  const [pauseLoading, setPauseLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const onFinish = useCallback(
    (value) => {
      const data = form.getFieldsValue();
      if(!data.ip){
        data.ip = '全部'
      }
      onSearch({ isSearch: false, ...data });
    },
    [onSearch]
  );

  const onResetSearch = useCallback(
    (value) => {
      const data = form.getFieldsValue();
      if(!data.key_word || data.key_word.length === 0){
        return;
      }
      form.resetFields()
      form.setFieldValue("ip",'全部')
      data.ip = '全部'
      data.key_word = []
      onSearch({ isSearch: false, ...data });
    },
    [onSearch]
  );

  const navigate = useNavigate();


  const pauseSearch = useCallback(async () => {
    setPauseLoading(true);
    await pause();
    setPauseLoading(false);
  }, [onSearch]);

  const typeRadioChange = debounce((e: RadioChangeEvent) => {
    changePageType(e.target.value);
  }, 100);

  const [items,setItems] = useState(['多少钱'])
  const [name,setName] = useState('')
  const [hoverKey,setHoverKey] = useState(-1)
  const [selectKeys,setSelectKeys] = useState<any>([])
  const [modalOpen,setModalOpen] = useState(false)

  const keyWordRef = useRef<InputRef>(null);

  const [selectOptionVisible,setSelectOptionVisible] = useState(false);
  

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    
    e.preventDefault();
    if(!name){
      return;
    }
    const arr = [...items,name]
    setItems(arr)
    localStorage.setItem("keywords",JSON.stringify(arr))
    
    setTimeout(() => {
      keyWordRef.current?.focus();
      setName('')
    }, 0);
  };

  const onDeleteSelectItem = (e,item) => {
    debugger
    e.stopPropagation()
    const arr = items.filter(e => e !== item);
    setItems(arr)
    localStorage.setItem("keywords",JSON.stringify(arr))
  }



  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const sendMessageModal = () => {
    setModalOpen(true)
  };

  const handleModelClose = () => {
    setModalOpen(false)
  }

  const handleOnSendSuccess = () => {
    changeFollowStateAndClear();
  }

  const onItemShow = (index) => {
    setHoverKey(index)
      setSelectOptionVisible(true)
  }

  const onItemHide = () => {
    setSelectOptionVisible(false)
}
  useEffect(() => {

    const keywords = localStorage.getItem("keywords")
    if(keywords){
      setItems(JSON.parse(keywords))
    }

  },[])

  return (
    <div className="search-box">
      <Form<SearchValue> form={form} className="search-form-container">
        <Space
          style={{ width: "100%", justifyContent: "center", padding: 16 }}
          size={"large"}
        >
          <Form.Item name="ip" label="IP地址" >
              <Select options={selectOptions} style={{width:"100%"}} defaultValue={"全部"}></Select>
            </Form.Item>
            <Form.Item name="key_word" label="评论关键词" >
              {/* <Input placeholder="多个关键词以竖线 “|” 隔开"/> */}
              <Select
                mode="tags" 
                style={{width:300}}
                placeholder="请选择关键词"
                value={selectKeys}
                onChange={setSelectKeys}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space  style={{marginRight:20}}>
                      <Input
                        placeholder=""
                        ref={keyWordRef}
                        value={name}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        添加关键词
                      </Button>
                    </Space>
                  </>
                )}
                options={items.map((item,idx) => ({ label:<><span style={{flex:1,display:"block"}} onMouseEnter={() =>onItemShow(idx)} onMouseLeave={onItemHide} >
                  {item}
                {
                  (selectOptionVisible && idx === hoverKey && !selectKeys.includes(item)
                    && <DeleteFilled onClick={(e) => onDeleteSelectItem(e,item)} style={{position:'absolute',right:10}}/>)
                }
                </span></>, value: item }))}
              />
            </Form.Item>
            
            <Form.Item>
              <Button onClick={onFinish}>搜索</Button>
            </Form.Item>
            <Form.Item><Button onClick={onResetSearch}>重置</Button></Form.Item>
          <Form.Item>
            <Space>
              {curreent?.isHistory ? (
                ""
              ) : (
                <Button danger onClick={pauseSearch} loading={pauseLoading}>
                  停止爬取
                </Button>
              )}
              {/* <Button onClick={resSearch}>重新搜索</Button> */}
              {selectedRowKeys.length === 0 ? (
                <Button
                  disabled={selectedRowKeys.length === 0}
                  onClick={sendMessageModal}
                >
                  私信
                </Button>
              ) : (
                <Badge count={selectedRowKeys.length}>
                  <Button
                    disabled={selectedRowKeys.length === 0}
                    onClick={sendMessageModal}
                  >
                    私信
                  </Button>
                </Badge>
              )}
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <Radio.Group
        onChange={typeRadioChange}
        defaultValue={pageType}
        className="page-type-container"
      >
        <Radio.Button value={"card"}>
          <CreditCardOutlined />
        </Radio.Button>
        <Radio.Button value={"list"}>
          <MenuOutlined />
        </Radio.Button>
      </Radio.Group>
      <MessageModal show={modalOpen} onClose={handleModelClose} onSendSuccess={handleOnSendSuccess} data={[...selectRowMap?.values()!]} 
      searchId={curreent?.id}></MessageModal>
    </div>
  );
};

export default memo(Search);
