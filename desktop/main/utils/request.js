
const request = (config) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(config);
      if (res.status === 200) {
        resolve(res.json());
      } else {
        reject(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = request;
exports.request = request;
