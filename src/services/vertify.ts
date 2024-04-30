import request from "@src/common/requestUtils";
export const vertifyCode = (code: string) => {
  return request({
    url: "/activation_code",
    method: "POST",
    params: { code },
  });
};

export const vertifyServer = () => {
  return request({
    url: "/have_service",
    method: "GET",
  });
};
