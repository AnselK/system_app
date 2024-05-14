import { Navigate, RouteObject } from "react-router-dom";
import React from "react";
import { lazy } from "react";

const Loading = lazy(() => import("@pages/Loading"));
const Data = lazy(() => import("@pages/DataPage"));
const Login = lazy(() => import("@pages/VertifyPage"));
const Index = lazy(() => import("@pages/Index"));
const SearchIndex = lazy(() => import("@pages/SearchIndex"));
const ProtectRoute = lazy(() => import("@src/components/protectRoute"));
const App = lazy(() => import("@app/app"));

const routes: Array<RouteObject & { redirect?: string }> = [
  {
    path: "/",
    element: <Navigate to="/loading"></Navigate>,
  },
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "/home",
        element: (
          <ProtectRoute>
            <Data />
          </ProtectRoute>
        ),
      },
      {
        path: "/search",
        element: <SearchIndex />,
      },
    ],
  },

  {
    path: "/loading",
    element: <Loading />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default routes;
