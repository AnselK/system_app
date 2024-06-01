import { Video } from "@src/pages/DataPage/type";

type SearchParams = {
  sort_type: number;
  publish_time: number;
  filter_duration: number;
  search_range: number;
};
export interface SearchsItemType {
  id?: number;
  search: string;
  isHistory: boolean;
  search_params?: SearchParams;
  loading?:boolean
  list?:Video[],
  crawered?:boolean
  comment_count?:number;
}
