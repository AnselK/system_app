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



const circleREQ = (fn,time=16)=>{
  const timeout = setTimeout || setImmediate
  let flag = false
  function REQ(...args){
    timeout(()=>fn(...args),time)
  }
}