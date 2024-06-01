import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button, Form, Input, Badge, Space } from "antd";
import { CloseCircleTwoTone } from "@ant-design/icons";
import { debounce } from "@src/common/functionUtils";
const setMessages = debounce((key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
}, 64);

const DynamicTextAreaForm = forwardRef(
  ({ searchId }: { searchId: string | number }, ref) => {
    const [textAreas, setTextAreas] = useState([{ id: 1, value: "" }]);
    const [form] = Form.useForm();
    useEffect(() => {
      const savedTextAreas = localStorage.getItem(`${searchId}_messages`);
      if (savedTextAreas) {
        setTextAreas(JSON.parse(savedTextAreas));
      } else {
        setTextAreas([{ id: 1, value: "" }]);
      }
    }, []);

    const addTextArea = () => {
      const newId =
        textAreas.length > 0 ? textAreas[textAreas.length - 1].id + 1 : 1;
      setTextAreas([...textAreas, { id: newId, value: "" }]);
    };

    const handleTextChange = (id, event) => {
      const newTextAreas = textAreas.map((textArea) => {
        if (textArea.id === id) {
          return { ...textArea, value: event.target.value };
        }
        return textArea;
      });
      setTextAreas(newTextAreas);
    };

    // 删除 TextArea
    const deleteTextArea = (id) => {
      const newTextAreas = textAreas.filter((textArea) => textArea.id !== id);
      setTextAreas(newTextAreas);
    };

    useImperativeHandle(ref, () => ({
      getMessages() {
        const data = form.getFieldsValue();
        if (textAreas) {
          const c = textAreas
            ?.map((item) => {
              if (data[item.id]) {
                return { ...item, value: data[item.id] };
              }
              return;
            })
            .filter((i) => i);
          setMessages(`${searchId}_messages`, c);
          return c;
        }
        return;
      },
    }));

    return (
      <Form form={form} wrapperCol={{ span: 24 }}>
        {textAreas.map((textArea) => (
          <Form.Item key={textArea.id} name={textArea.id}>
            <Badge
              styles={{ root: { width: "100%" } }}
              count={
                <CloseCircleTwoTone
                  twoToneColor={"#ff4d4f"}
                  onClick={(e) => deleteTextArea(textArea.id)}
                />
              }
            >
              <Input.TextArea style={{ width: "100%" }} />
            </Badge>
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="dashed" onClick={addTextArea} style={{ width: "100%" }}>
            添加私信
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default DynamicTextAreaForm;
