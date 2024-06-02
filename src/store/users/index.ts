import { createSlice, Dispatch } from "@reduxjs/toolkit";
import to from "@src/common/requestUtils/to";
import { getSysConfig } from "@src/services/setting";

const initialState = {
  sys: {
    data_storage_day: 7,
    auto_save_data: 0,
    save_followed_data: 1,
  },
  server:{
    started:false
  }
};

export const asyncConfigChunk = () => {

  return (dispatch: Dispatch) => {
    getSysConfig()
      .then((res) => {
        dispatch(setSysConfig(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const userSlice = createSlice({
  name: "user_store",
  initialState,
  reducers: {
    setSysConfig(state, action) {
      state.sys = action.payload;
    },
    changeServerStatus(state,action){
      state.server.started = action.payload
    }
  },
});

export const { setSysConfig,changeServerStatus } = userSlice.actions;
export default userSlice.reducer;
