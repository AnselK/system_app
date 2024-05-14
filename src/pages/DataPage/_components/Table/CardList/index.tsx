import React, { memo } from "react";
import type { Video } from "../../../type";
import Card from '../Card'

interface CardListProps {
  dataSource: Video[];
}

const CardList: React.FC<CardListProps> = ({ dataSource }) => {
  return (
    <>
      {dataSource?.map((item, index) => (
        <Card data={item} dataSource={item.list} key={item.video_id}></Card>
      ))}
    </>
  );
};
export default memo(CardList);
