import React from "react";
import ReactDOM from "react-dom/client";
import App from "@app/app";
import { HashRouter, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
const mapRoutes = (routes) => {
  if (!Array.isArray(routes)) {
    return null;
  }

  return routes.map((route, index) => {
    return (
      <>
        <Route
          key={route.path + index || index}
          path={route.path}
          element={route.element}
        >
          {route.children ? mapRoutes(route.children) : void 0}
        </Route>
      </>
    );
  });
};

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <ConfigProvider>
    <HashRouter>
      <App />
      {/* <Routes>{mapRoutes(routes)}</Routes> */}
    </HashRouter>
  </ConfigProvider>
);
