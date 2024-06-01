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
      state.msgs.push({ ...action.payload, id });
    },
    doneMsg(state, action) {
      const { dones, index, id } = action.payload;
      state.done.push(...dones);
    },
    allDonedMsg(state, action) {
      state.done = [];
      state.hasMessage = false;
      state.msgs = [];
    },
  },
});

export const { addMsg, doneMsg, allDonedMsg } = msgSlice.actions;

export default msgSlice.reducer;
