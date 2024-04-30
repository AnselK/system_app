import axios from "axios";

const CancelToken = axios.CancelToken

export const cancelToken = ()=>{
    return CancelToken.source()
}
