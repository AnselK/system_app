import { createSlice } from "@reduxjs/toolkit";
import { createId } from "@src/common/constUtils";

const initialState = {
  msgs: [] as any[],
  done: [] as any[],
  hasMessage: false,
};

export const msgSlice = createSlice({
  name: "msg_store",
  initialState,
  reducers: {
    addMsg(state, action) {
      const id = createId();
      state.msgs.push(action.payload);
    },
    doneMsg(state, action) {
      const { del, dones, index } = action.payload;
      if (dones) {
        const len = state.done.length;
        const last = len === 0 ? state.msgs[index] : state.done[len - 1];
        state.done.splice(len - 1, len, {
          ...last,
          links: [...last.dones, ...dones],
        });
      }
      if (del) {
        state.msgs.shift();
        state.msgs = [...state.msgs];
      }
    },
  },
});

export const { addMsg, doneMsg } = msgSlice.actions;

export default msgSlice.reducer;
