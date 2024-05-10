const http = require("http");
const options = {
  hostname: "example.com",
  port: 80,
  path: "/api/data",
  method: "GET",
  timeout: 5000,
};
const request = (path, config = {}) => {
  return new Promise((resolve, reject) => {
    const req = http.request(path, (res) => {
      if (res.statusCode === 200) {
        resolve(res);
      }
      console.log(`状态码: ${res.statusCode}`);
      let data = "";
      // 接收数据
      res.on("response", (chunk) => {
        data += chunk;
      });
      // 请求完成
      res.on("end", () => {
        resolve(data);
      });
    });
    req.on("timeout", (e) => {
      req.destroy(); // 超时时终止请求
      reject(e);
      console.error("请求超时");
    });
    req.on("response", (e) => {
      resolve(e);
    });
    // 请求错误处理
    req.on("error", (e) => {
      reject(e);
    });
    req.on("finish", (e) => {
      resolve(e);
    });
    req.end();
  });
};

module.exports = request;
exports.request = request;
