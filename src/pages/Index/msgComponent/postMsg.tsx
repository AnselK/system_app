import to from "@src/common/requestUtils/to";
import { sendMessage } from "@src/services/data";
type msgReq = {
  msgs: string;
  data: any[];
  id: string | number;
  do_message: boolean;
  searchId: number;
};
const flag = 5;
const timeout = setTimeout || requestAnimationFrame
class PostMsg {
  totals: Array<msgReq> = [];
  current: msgReq | undefined;
  currentMsg;
  is_post = false;
  Callback: Function;
  flag: number = 0;
  constructor(sendedCallback: Function) {
    this.Callback = sendedCallback;
    this.start();
  }
  start() {
    if (this.totals.length === 0) return;
    this.idleCalback();
  }
  idleCalback() {
    requestIdleCallback(() => {
      this.post();
    });
  }
  async post() {
    let p_links;

    if (!this.current) {
      this.current = this.totals[0];
    }
    if (this.currentMsg) {
      if (this.flag >= flag) return;
      this.flag++
      p_links = this.currentMsg.data;
    } else {
      if (this.current.data.length === 0) {
        this.totals.splice(0, 1);
        this.current = { ...this.totals[0]! };

        if (!this.current) {
          this.currentMsg = undefined;
          this.is_post = false;
          return;
        }
      }

      p_links = this.current.data.splice(0, 5);
    }
    this.is_post = true;
    this.currentMsg = {
      ...this.current,
      data: p_links,
    };
    const [_, error] = await to(sendMessage, this.currentMsg);
    if (!error) {
      this.Callback({
        id: this.current.id,
        del: this.current.data.length === 0,
        dones: p_links,
        index: 0,
      });
      this.flag = 0
      this.currentMsg = null;
      timeout(()=>{
        this.idleCalback();
      },1000)
    }else{
      this.idleCalback();

    }
  }
  add(fetchs) {
    let data = JSON.parse(JSON.stringify(fetchs));
    if (this.totals.length !== 0) {
      data = data.filter(
        (item) => this.totals.findIndex((d) => d.id + "" === item.id + "") < 0
      );
    }

    this.totals.push(...data);
    if (!this.is_post) this.idleCalback();
  }
}

export default PostMsg;
