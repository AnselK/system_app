const { spawn } = require("child_process");
const request = require("../../utils/request");

class EXE {
  CURRENT_EXE_PROCEE = null;
  EXE_PATH = null;
  err_callback = null;
  close_callback = null;
  data_callback = null;
  success_callback = null;
  SERVER_START = false;
  constructor(path, params = {}) {
    const { onError, onData, onClose, onSuccess } = params;
    this.err_callback = onError;
    this.data_callback = onData;
    this.close_callback = onClose;
    this.success_callback = onSuccess;
    this.EXE_PATH = path;
  }
  start_exe(cb, path, params) {
    if (this.SERVER_START) return;
    const p = this.EXE_PATH ?? path;
    console.log(p, "pppp");
    if (!p) throw new Error("the exe path is undefined");

    this.CURRENT_EXE_PROCEE = spawn(p, params);
    this.IntersectionObserverEntry();
    this.vertifyServerSuccess(cb);
  }
  IntersectionObserverEntry() {
    const { CURRENT_EXE_PROCEE } = this;
    // 启动失败
    CURRENT_EXE_PROCEE.on("error", this.onError);
    // 服务输出
    CURRENT_EXE_PROCEE.stdout.on("data", this.onData);
    // 服务端错误
    CURRENT_EXE_PROCEE.stderr.on("data", this.onError);
    // 服务关闭
    CURRENT_EXE_PROCEE.on("close", this.onClose);
  }
  onError() {
    if (this.err_callback) {
      this.err_callback(this.CURRENT_EXE_PROCEE);
    }
  }
  onData() {
    if (this.data_callback) {
      this.data_callback(this.CURRENT_EXE_PROCEE);
    }
  }
  onClose() {
    if (this.close_callback) {
      this.close_callback(this.CURRENT_EXE_PROCEE);
    }
  }
  onSuccess() {
    if (this.success_callback) {
      this.success_callback(this.CURRENT_EXE_PROCEE);
    }
  }
  vertifyServerSuccess(cb) {
    vertify((type) => {
      cb(type);
      if (!type) {
        if (this.err_callback) {
          this.err_callback(this.CURRENT_EXE_PROCEE);
        }
        this.end_exe();
        return;
      }
      this.SERVER_START = true;
    });
  }
  end_exe(id, cb) {
    this.CURRENT_EXE_PROCEE.kill && this.CURRENT_EXE_PROCEE.kill("SIGTERM");
    this.CURRENT_EXE_PROCEE = null;
    cb && cb();
    this.SERVER_START = false;
  }
}

const options = {
  hostname: "127.0.0.1",
  port: 5001,
  path: "/have_service",
  method: "GET",
};

function vertify(cb) {
  let times = 0;
  let timer;
  async function callback() {
    times++;
    try {
      await request(options);
      cb(true);
      return;
    } catch (error) {
      if (times > 10) {
        cb(false);
        return;
      }
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        callback();
      }, 1000);
    }
  }
  setTimeout(callback, 2000);
}

module.exports = EXE;
