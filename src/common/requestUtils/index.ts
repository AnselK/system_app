import axios from "axios";

const request = axios.create({
  baseURL: "http://127.0.0.1:5001/",
});

request.interceptors.response.use((response) => {
    return response.data;
});

export default request;
