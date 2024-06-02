const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { sign, vertify } = require("./utils/start");
const { INDEX_PATH, SERVER_POD, isDevelopment } = require("./const/global");
const { app } = require("electron");
const { storeCode } = require("./utils/end");
const ExeManage = require("./utils/exe");

let mainWindow = null;

let exe = new ExeManage(SERVER_POD);

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1160,
    height: 752,
    minHeight: 632,
    minWidth: 960,
    show: false,
    frame: false,
    title: "Mohoo",
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, "../utils/contextBridge.js"),
    },
    icon: path.resolve(__dirname, "../assets/mohoo.png"),
  });

  if (isDevelopment) {
    mainWindow.loadURL("http://localhost:8001/");
  } else {
    mainWindow.loadFile(INDEX_PATH);
    // const entryPath = path.resolve(__dirname, '../../build/index.html')
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    setTimeout(() => {
      exe.start_exe();
    });
  });

  mainWindowListenEvents();
}

function mainWindowListenEvents() {
  app.on("before-quit", () => {
    exe.end_exe();
    exe = null;
  });

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
    mainWindowIsExist() && mainWindow.hide();
  });

  ipcMain.on("mainWindow-open-devtool", () => {
    mainWindowIsExist() && mainWindow.webContents.openDevTools();
  });

  ipcMain.on("vertify-code-success", (e, code) => {
    storeCode(code);
  });

  ipcMain.on("mainWindow-rendered", () => {});
  ipcMain.on("mainWindow-vertify-serve", () => {
    if (exe.started) {
      mainWindow.webContents.send("server-success");
      return getUserInfo();
    }
    if (exe.loading) return;
    exe.vertifyServerSuccess((flag) => {
      if (flag) {
        mainWindow.webContents.send("server-success");
        getUserInfo();
      } else {
        mainWindow.webContents.send("server-error");
      }
    });
  });

  ipcMain.on("main-vertify-success", (e, code) => {
    sign(code, (flag) => {
      if (!flag) {
        mainWindow.webContents.send("store-code-error");
      } else {
        mainWindow.webContents.send("store-code-success");
      }
    });
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
