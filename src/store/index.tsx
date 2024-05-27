import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import mianData from "./search/index";
import { thunk } from "redux-thunk";
import msgStore from "./message";
export const store = configureStore({
  reducer: {
    main_data: mianData,
    msg_store: msgStore,
  },
});
