import React from "react";
import ReactDOM from "react-dom/client";
import App from "@app/app";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
// import router from "./router";
// import '@src/svgIcons'

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(<ConfigProvider><HashRouter><App/></HashRouter></ConfigProvider>);
