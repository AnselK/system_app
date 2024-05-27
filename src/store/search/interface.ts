type SearchParams = {
  sort_type: number;
  publish_time: number;
  filter_duration: number;
  search_range: number;
};
export interface SearchsItemType {
  current_id?: string;
  key_word: string;
  isHistory: boolean;
  search_params?: SearchParams;
}
