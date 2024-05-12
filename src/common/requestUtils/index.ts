import axios from "axios";

const request = axios.create({
  baseURL: "http://127.0.0.1:5001/",
  timeout:5000000
});

request.interceptors.response.use((response) => {
  if(response.status !== 200){
    return Promise.reject(response)
  }
    return response.data;
});

export default request;
