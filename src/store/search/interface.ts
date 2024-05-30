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
  comment_count?:number;
}
