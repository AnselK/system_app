import { Navigate, RouteObject } from "react-router-dom";
import React from "react";
import { lazy } from "react";

const Loading = lazy(() => import("@pages/Loading"));
const Home = lazy(() => import("@pages/DataPage"));
const Login = lazy(() => import("@pages/VertifyPage"));
const App = lazy(() => import("@app/app"));

const routes: Array<RouteObject & { redirect?: string }> = [
  {
    path: "/",
    element: <Navigate replace to="/loading"></Navigate>,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/loading",
        element: <Loading />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  
];

export default routes;
