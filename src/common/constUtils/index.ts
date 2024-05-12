export const createId = (preffix: string = "", suffix: string = ""): string => {
  return preffix + new Date().getTime() + suffix;
};
