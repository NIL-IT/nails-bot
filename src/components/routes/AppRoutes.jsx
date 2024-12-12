import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { ROUTES } from "./routes";
import SingleProduct from "../pages/SingleProduct";
import SingleCategory from "../pages/SingleCategory";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PRODUCT} element={<SingleProduct />} />
      <Route path={ROUTES.CATEGORY} element={<SingleCategory />} />
    </Routes>
  );
};

export default AppRoutes;
