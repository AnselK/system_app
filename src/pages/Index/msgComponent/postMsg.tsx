import { Dispatch } from "@reduxjs/toolkit";
import to from "@src/common/requestUtils/to";
import { sendMessage } from "@src/services/data";
import { doneMsg } from "@src/store/message";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
type msgReq = { msg: string; links: string[] };
const flag = 5;
class PostMsg {
  totals: Array<msgReq> = [];
  dispatch: Dispatch;
  current: msgReq = { links: [], msg: "" };
  currentMsg;
  is_post = false;
  constructor() {
    this.start();
    this.dispatch = useDispatch();
    this.totals = useSelector((state: any) => state.msg_store.msgs);
    useEffect(() => {
      if (this.totals.length > 0 && !this.is_post) {
        this.start();
      }
    }, [this.totals]);
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
    if (this.currentMsg) {
      p_links = this.currentMsg.homepage_links;
      msgs = this.currentMsg.msg;
    } else {
      if (this.current.links.length === 0) {
        this.current = { ...this.totals[0]! };

        if (!this.current) return;
      }
      const { msg, links } = this.current;
      msgs = msg;
      p_links = links.splice(0, 5).filter((item) => !!item);
    }
    this.is_post = true;
    this.currentMsg = {
      msg: msgs,
      homepage_links: p_links,
    };
    const [_, error] = await to(sendMessage, this.currentMsg);
    if (!error) {
      this.dispatch(
        doneMsg({
          del: this.current.links.length === 0,
          dones: p_links,
          index: 0,
        })
      );
      this.currentMsg = null;
    }
    this.idleCalback();
  }
  add(fetchs) {
    this.totals.push(...fetchs);
    if (!this.is_post) this.idleCalback();
  }
}

export default PostMsg;
