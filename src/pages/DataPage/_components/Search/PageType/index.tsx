import { pageContext } from "@src/pages/DataPage";
import { Radio, RadioChangeEvent } from "antd";
import { CreditCardOutlined, MenuOutlined } from "@ant-design/icons";
import React, { memo, useContext } from "react";
import { debounce } from "@src/common/functionUtils";

const PageType = () => {
  const { changePageType, pageType } = useContext(pageContext);
  const typeRadioChange = debounce((e: RadioChangeEvent) => {
    changePageType(e.target.value);
  });
  return (
    <>
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
    </>
  );
};

export default memo(PageType);
