// 当前使用code
let CURRENT_CODE = null;
const storeCode = (code) => {
  CURRENT_CODE = code;
};

const cleaarCode = (code) => {
  CURRENT_CODE = null;
};

module.exports = {
  storeCode,
};
