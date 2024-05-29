import React, {  useEffect, useState } from "react";
import { Menu,Button,Modal,Tooltip } from "antd";
import {DeleteFilled} from '@ant-design/icons';

const MenuItem = ({children,...props}) => {

    const [showButton,setShowButton] = useState(false);
    const [showModel, setShowModel] = useState(false);


    useEffect(() => {

    },[showButton])

    const onMenuButtonClick = (e) => {
        console.log("sadsa",props)
        e.stopPropagation();
        setShowModel(true)
    }

    const handleOk = (e) => {
        e.stopPropagation();
        setShowModel(false);
    }

    
    const handleCancel = (e) => {
        e.stopPropagation();
        setShowModel(false);
    }

    return (
        <Menu.Item
          {...props}
          onMouseEnter={() => {setShowButton(true)}}
          onMouseLeave={() => {setShowButton(false)}}
        >
          <div >
            <Tooltip title={"占用内存:【"+props.memory+"M】标题:【"+children+"】"}>
            <span style={{textOverflow:"ellipsis",overflow:"hidden",display:"inline-block",maxWidth:"90%"}}>{children}</span>
            </Tooltip>
            {showButton && <Button onClick={onMenuButtonClick}   type="text" size="small" style={{position:"absolute", right:10,marginTop:10}}><DeleteFilled /></Button>}
            <Modal title="删除搜索历史会删除该历史下的所有视频及评论，是否确认" 
                open={showModel} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消">
                
            </Modal>
          </div>
        </Menu.Item>
      );

}

export default MenuItem;