import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { ROUTES } from "./routes";
import SingleProduct from "../pages/SingleProduct";
import SingleCategory from "../pages/SingleCategory";
import Cart from "../pages/Cart";
import SearchItems from "../pages/SearchItems";
import OrderHistory from "../pages/OrderHistory";
import { USERS } from "../../utils/data";
import OrderHistoryAdmin from "../pages/OrderHistoryAdmin";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PRODUCT} element={<SingleProduct />} />
      <Route path={ROUTES.CATEGORY} element={<SingleCategory />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.SEARCH} element={<SearchItems />} />
      {USERS[0].isAdmin ? (
        <>
          <Route path={ROUTES.PROFILE} element={<OrderHistoryAdmin />} />
        </>
      ) : (
        <>
          <Route path={ROUTES.PROFILE} element={<OrderHistory />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
