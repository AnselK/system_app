export const omitProperty = <T extends object>(
  obj: T,
  k: keyof T | Array<keyof T>
) => {
  if (!Array.isArray(k)) {
    k = [k];
  }

  return Object.keys(obj).reduce((newObj, key) => {
    if (!k.includes(key as keyof T)) {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {} as T);
};
