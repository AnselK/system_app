import React, {
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  Suspense,
  useState,
} from "react";
import DesktopHeader from "@components/desktopHeader";
import { Route, useRoutes } from "react-router-dom";
import routes from "@src/router";
import "./app.less";
import {
  isDesktop,
  getProcessNodeEnv,
  ipcRendererSend,
} from "@common/desktopUtils";
import Loading from "@src/components/Loading";

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

function App() {
  const openDevtoolInput = useRef<HTMLInputElement>(null);
  const isDevelopment = useRef(getProcessNodeEnv() === "development");
  const [loaded, setLoaded] = useState<boolean>();
  const openDevtool = useCallback(() => {
    ipcRendererSend("mainWindow-open-devtool");
  }, []);

  const openDevtoolInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === "openDevtool") {
      openDevtool();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const { ctrlKey, metaKey, altKey, key } = e;
      // 开发环境使用ctrl + F12打开控制台
      if (isDevelopment.current && ctrlKey && key === "F12") {
        openDevtool();
      }
      // 开发环境使用ctrl + win + alt + F12，然后键入'open devtool'打开控制台
      if (
        !isDevelopment.current &&
        ctrlKey &&
        metaKey &&
        altKey &&
        key === "F12"
      ) {
        if (openDevtoolInput.current) {
          openDevtoolInput.current.focus();
        }
      }
    });
  }, [openDevtool]);

  return (
    <div id="electron-app">
      {!isDevelopment.current && (
        <input
          className="open-devtool-input"
          ref={openDevtoolInput}
          type="text"
          onChange={openDevtoolInputChange}
          onBlur={(e) => {
            e.target.value = "";
          }}
        />
      )}
      {isDesktop() && <DesktopHeader />}
      <div className={isDesktop() ? "desktop-app-content" : "app-content"}>
        {/* {useRoutes(routes)}F */}
        {loaded ? (
          <Loading></Loading>
        ) : (
          <Suspense fallback="加载中...">
            {/* <Routes>{mapRoutes(routes)}</Routes> */}
            {/* <Outlet></Outlet> */}
            {useRoutes(routes)}
          </Suspense>
        )}

        {/* <VertifyPage></VertifyPage> */}
        {/* <div className="electron-img">
                    <img src={electronImg} alt="" />
                </div> */}
      </div>
    </div>
  );
}

export default App;
