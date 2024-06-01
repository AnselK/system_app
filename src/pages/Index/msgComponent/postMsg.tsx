import to from "@src/common/requestUtils/to";
import { sendMessage } from "@src/services/data";
type msgReq = { msg: string; links: string[]; id: string | number };
const flag = 5;
class PostMsg {
  totals: Array<msgReq> = [];
  current: msgReq | undefined;
  currentMsg;
  is_post = false;
  Callback: Function;
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
    let msgs;

    if (!this.current) {
      this.current = this.totals[0];
    }
    if (this.currentMsg) {
      p_links = this.currentMsg.homepage_links;
      msgs = this.currentMsg.msg;
    } else {
      if (this.current.links.length === 0) {
        this.totals.splice(0, 1);
        this.current = { ...this.totals[0]! };

        if (!this.current) {
          this.currentMsg = undefined;
          this.is_post = false;
          return;
        }
      }
      const { msg } = this.current;
      msgs = msg;

      p_links = this.current.links.splice(0, 5);
    }
    this.is_post = true;
    this.currentMsg = {
      msg: msgs,
      homepage_links: p_links,
    };
    const [_, error] = await to(sendMessage, this.currentMsg);
    if (!error) {
      this.Callback({
        id: this.current.id,
        del: this.current.links.length === 0,
        dones: p_links,
        index: 0,
      });
      this.currentMsg = null;
    }
    this.idleCalback();
  }
  add(fetchs) {
    let data = JSON.parse(JSON.stringify(fetchs));
    if (this.totals.length !== 0) {
      data = fetchs.filter(
        (item) => this.totals.findIndex((d) => d.id + "" === item.id + "") < 0
      );
    }

    this.totals.push(...data);
    if (!this.is_post) this.idleCalback();
  }
}

export default PostMsg;
