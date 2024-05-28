import request from "@src/common/requestUtils";

export const updateSetting = (data) => {
  return request({
    url: "/update_sys_config",
    method: "POST",
    data,
  });
};

export const getSysConfig = () => {
  return request({
    method: "GET",
    url: "/get_sys_config",
  });
};
