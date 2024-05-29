import React, {  useEffect, useState } from "react";
import { Menu,Button,Modal,Tooltip } from "antd";
import {DeleteFilled} from '@ant-design/icons';

const MenuItem = ({children,...props}) => {

    const [showButton,setShowButton] = useState(false);

    useEffect(() => {

    },[showButton])

    const onMenuButtonClick = (e) => {
        e.stopPropagation();
        props.onDelete(props.eventKey)
    }


    return (
        <Menu.Item
          {...props}
          onMouseEnter={() => {setShowButton(true)}}
          onMouseLeave={() => {setShowButton(false)}}
        >
          <div >
            <Tooltip placement="right"  title={"占用内存:【"+props.mem+"M】标题:【"+children+"】"}>
            <span style={{textOverflow:"ellipsis",overflow:"hidden",display:"inline-block",maxWidth:"90%"}}>{children}</span>
            </Tooltip>
            {showButton && <Button onClick={onMenuButtonClick}   type="text" size="small" style={{position:"absolute", right:10,marginTop:10}}>
              <DeleteFilled /></Button>}
          </div>
        </Menu.Item>
      );

}

export default MenuItem;