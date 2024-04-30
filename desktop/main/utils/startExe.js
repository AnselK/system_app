const { exec } = require("child_process");
const start_exe = (exePath,cb) => {
  console.log(exec,'exec');
  let process_id = exec(exePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${error}`);
      cb(false);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    cb(true);
  });
  return process_id
};

// start_exe(dirNmae('../../utils/flask_api.exe'),(type)=>{
//   console.log(type,'tttt');
// })

module.exports = start_exe;
