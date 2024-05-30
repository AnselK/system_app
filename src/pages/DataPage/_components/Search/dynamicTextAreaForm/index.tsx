import React, { useState,useEffect } from 'react';
import { Button, Form, Input,Badge, Space } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';

const DynamicTextAreaForm = () => {
  const [textAreas, setTextAreas] = useState([{ id: 1, value: '' }]);


  useEffect(() => {
    const savedTextAreas = localStorage.getItem('messages');
    if (savedTextAreas) {
      setTextAreas(JSON.parse(savedTextAreas));
    } else {
      setTextAreas([{ id: 1, value: '' }]);
    }
  }, []);

  const addTextArea = () => {
    const newId = textAreas.length > 0 ? textAreas[textAreas.length - 1].id + 1 : 1;
    setTextAreas([...textAreas, { id: newId, value: '' }]);
    localStorage.setItem('messages',JSON.stringify(textAreas.filter(e => e.value !== '')))
  };

  const handleTextChange = (id, event) => {
    const newTextAreas = textAreas.map(textArea => {
      if (textArea.id === id) {
        return { ...textArea, value: event.target.value };
      }
      return textArea;
    });
    setTextAreas(newTextAreas);
  };

  // 删除 TextArea
  const deleteTextArea = (id) => {
    const newTextAreas = textAreas.filter(textArea => textArea.id !== id);
    setTextAreas(newTextAreas);
  };

  return (
      <form style={{width:"100%"}}>
        {textAreas.map(textArea => (
        <Form.Item style={{width:"100%"}} key={textArea.id}>
          <Space>
          <Badge  count={<CloseCircleTwoTone twoToneColor={"#ff4d4f"} onClick={e => deleteTextArea(textArea.id)}/>}>
          <Input.TextArea
            style={{width:"100%"}} 
            value={textArea.value}
            onChange={e => handleTextChange(textArea.id, e)}
          />
          </Badge>
          </Space>
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={addTextArea} style={{ width: '100%' }}>
          添加私信
        </Button>
      </Form.Item>
      </form>
  );
};

export default DynamicTextAreaForm;
