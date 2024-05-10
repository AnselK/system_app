const { app } = require("electron");
const path = require("path");
const dirNmae = (paths) => {
  return path.resolve(__dirname, paths);
};
const root = path.resolve(path.dirname(app.getAppPath()), "..");
const LOGIN_PATH = dirNmae("../../../build/login/index.html");
const INDEX_PATH = dirNmae("../../../build/index.html");
const PASS_WORD_FILE_PATH = "\\user\\p_w\\";
const PASS_WORD_FILE_NAME = "p_w.txt";
const isDevelopment = process.env.NODE_ENV === "development";
const EXT_PATH = "\\flask_api.exe";
const SERVER_POD = isDevelopment
  ? app.getAppPath() + EXT_PATH
  : root + EXT_PATH;
const ROOT = root;
module.exports = {
  LOGIN_PATH,
  INDEX_PATH,
  PASS_WORD_FILE_PATH,
  PASS_WORD_FILE_NAME,
  ROOT,
  SERVER_POD,
};
