class DataCahe<T extends object, K extends Array<any>> {
  #_cache?: WeakMap<T, K>;
  constructor(init?: Array<[T, K]>) {
    this.#_cache = new WeakMap(init);
  }
  set(key: T, value: K, push: boolean = false) {
    if (push) {
      const cacheData = [...this.get(key), ...value] as K;
      this.#_cache?.set(key, cacheData);
      return;
    }
    this.#_cache?.set(key, value);
    return;
  }
  has(key: T) {
    return this.#_cache?.has(key);
  }
  get(key: T) {
    if (!this.has(key)) return [];
    return this.#_cache?.get(key) || [];
  }
}

let initcache;

export default function Cache<T extends object, K extends Array<any>>(...args) {
  if (initcache) return initcache;
  initcache = new DataCahe<T, K>(...args);
  return initcache;
}
