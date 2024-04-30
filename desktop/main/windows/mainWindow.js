const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const vertify = require("./utils/start");
const { sign } = require("./utils/start");
const { INDEX_PATH, SERVER_POD } = require("./const/global");
const { exec } = require("child_process");

const isDevelopment = process.env.NODE_ENV === "development";
let mainWindow = null;
let process_id = null;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1160,
    height: 752,
    minHeight: 632,
    minWidth: 960,
    show: false,
    frame: false,
    title: "Harbour",
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, "../utils/contextBridge.js"),
    },
    icon: path.resolve(__dirname, "../assets/logo.png"),
  });

  if (isDevelopment) {
    mainWindow.loadURL("http://localhost:8000/");
  } else {
    mainWindow.loadFile(INDEX_PATH);
    // const entryPath = path.resolve(__dirname, '../../build/index.html')
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    start_exe(SERVER_POD, (flag) => {
      if (flag) {
        mainWindow.webContents.send("server-success");
        getUserInfo();
      } else {
        mainWindow.webContents.send("server-error");
      }
    });
  });

  mainWindowListenEvents();
}

function start_exe(exePath, cb) {
  process_id = exec(exePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${error}`);
      cb(false);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    cb(true);
  });
}

function mainWindowListenEvents() {
  ipcMain.on("mainWindow-min", () => {
    mainWindowIsExist() && mainWindow.minimize();
  });

  ipcMain.on("mainWindow-max", () => {
    if (mainWindowIsExist()) {
      mainWindow.maximize();
      mainWindow.webContents.send("mainWindowIsMax", true);
    }
  });

  ipcMain.on("mainWindow-restore", () => {
    if (mainWindowIsExist()) {
      mainWindow.unmaximize();
      mainWindow.webContents.send("mainWindowIsMax", false);
    }
  });

  ipcMain.on("mainWindow-close", () => {
    if (process_id) process_id.kill();
    mainWindowIsExist() && mainWindow.hide();
  });

  ipcMain.on("mainWindow-open-devtool", () => {
    mainWindowIsExist() && mainWindow.webContents.openDevTools();
  });

  ipcMain.on("main-vertify-success", (code) => {
    sign(code);
    // mainWindowIsExist() && mainWindow.loadFile(INDEX_PATH);
  });
}

function mainWindowIsExist() {
  return mainWindow && !mainWindow.isDestroyed();
}

function getMainWindow() {
  return mainWindow;
}

function getUserInfo() {
  vertify((code) => {
    mainWindow && mainWindow.webContents.send("user-code", code);
  });
}

module.exports = {
  getMainWindow,
  createMainWindow,
  mainWindowIsExist,
};
