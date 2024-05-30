import { useEffect, useMemo, useState } from "react";
import DataSeaarch from "../_cache/SearchData";
import { SearchsItemType } from "@src/store/search/interface";
import { debounce } from "@src/common/functionUtils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Video } from "../type";

interface config<T> {
  onSuccess: (data: T) => void;
  onError: (err: any) => void;
}

const cacheReq = new Map<string, DataSeaarch>();

function useFetch<T extends any>(current: SearchsItemType) {
  
}

export default useFetch;
