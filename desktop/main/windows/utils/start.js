const fs = require("fs");
const path = require("path");
const { dirNmae } = require("../utils/dir");
const request = require("../../utils/request");
const { PASS_WORD_FILE_PATH, PASS_WORD_FILE_NAME } = require("../const/global");
const { app } = require("electron");
const vertify = async (code) => {
  const config = {
    url: "",
    methods: "POST",
    data: {
      code,
    },
  };
  try {
    const res = await request(config);
    if (res.data) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

function vertifyLogin(cb) {
  const file_path = dirNmae(
    app.getAppPath() + PASS_WORD_FILE_PATH + PASS_WORD_FILE_NAME
  );
  fs.readFile(file_path, "utf-8", async (error, data) => {
    console.log(cb, "ccc");
    if (error) {
      cb(false);
      return;
    }
    console.log(cb, "ccc");
    // const status = await vertify(data);
    cb(data.trim());
  });
}

function createFile(filepath) {
  if (!fs.existsSync(filepath)) {
    try {
      fs.mkdirSync(filepath, { recursive: true }); // 使用 { recursive: true } 创建多级目录
      console.log("Directory created:");
    } catch (err) {
      console.error("Error creating directory:", err);
      return; // 创建目录失败，可以进行错误处理
    }
  }
}

function signIn(code, cb) {
  const file_path = dirNmae(
    app.getAppPath() + PASS_WORD_FILE_PATH + PASS_WORD_FILE_NAME
  );
  const dir_path = dirNmae(app.getAppPath() + PASS_WORD_FILE_PATH);
  let _i = 0;
  const write = (content) => {
    try {
      fs.writeFileSync(file_path, content, "utf-8");
      cb(true);
    } catch (error) {
      _i++;
      if (_i < 4) {
        write(code);
        return;
      }
      cb(false);
    }
  };
  let _read = 0;
  const read = () => {
    fs.readFile(file_path, "utf-8", async (error, data) => {
      console.log(error);
      if (error) {
        _read++;
        if (_read < 4) {
          read();
        }
        return;
      }
      const content = data + "\t" + code;
      write(content);
    });
  };
  fs.access(file_path, fs.constants.F_OK, (err) => {
    if (err) {
      createFile(dir_path);
      write(code);
      return;
    }
    read();
  });
}

const sign = signIn;

module.exports = {
  sign,
  vertify: vertifyLogin,
};
