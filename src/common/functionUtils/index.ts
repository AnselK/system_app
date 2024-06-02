export const debounce = (fn, time = 16) => {
  let timer: any | null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      try {
        fn(...args);
      } finally {
        timer = null;
      }
    }, time);
  };
};


 