const fs = require("fs");
const path = require("path");
const { dirNmae } = require("../utils/dir");
const request = require("../../utils/request");
const { PASS_WORD_FILE_PATH } = require("../const/global");

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
  const file_path = dirNmae(PASS_WORD_FILE_PATH);
  fs.readFile(file_path, "utf-8", async (error, data) => {
    if (error) {
      cb(false);
      return;
    }
    // const status = await vertify(data);
    cb(data.trim());
  });
}

function signIn() {
  let _i = 0;
  return function sign(code) {
    const file_path = dirNmae(PASS_WORD_FILE_PATH);
    fs.readFile(file_path, "utf-8", async (error, data) => {
      if (error) {
        cb(false);
        return;
      }
      const content = data + "\t" + code;
      try {
        fs.writeFileSync(file_path, content);
      } catch (error) {
        _i++;
        if (_i < 4) {
          sign(code);
        }
      }
    });
  };
}

const sign = signIn()

exports.vertify = vertifyLogin;
module.exports = vertifyLogin;
module.exports = sign;
