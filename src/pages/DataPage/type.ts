import { Key } from "react";

export interface searchProps {
  searchCol: string;
  search_info: string;
}

export interface SearchValue {
  ip: string;
  key_word: [];
}

export interface Video_Info {
  video_id: string;
  title: string;
  author_name: string;
  video_publish_time: string;
  duration: string;
  collect_count: string;
  comment_count: string;
  digg_count: string;
  share_count: string;
}

export interface Video extends Video_Info {
  list: Comment[];
}

export interface Comment {
  id:number
  uid: string;
  user_name: string;
  comment_time: string;
  comment_text: string;
  ip_address: string;
  homepage_link:string;
  has_letter:number;
}

export interface CommentsApi {
  has_more: 0 | 1;
  activation_code_status: boolean;
  all_finish: 0 | 1;
  comments_info: Comment[];
  video_info: Video_Info;
}


export interface HistoryData {
  comments_info: Comment[];
  video_info: Video_Info;
}