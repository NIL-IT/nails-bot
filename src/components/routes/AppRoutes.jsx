import React, { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { ROUTES } from "./routes";
import SingleProduct from "../pages/SingleProduct";
import SingleCategory from "../pages/SingleCategory";
import Cart from "../pages/Cart";
import SearchItems from "../pages/SearchItems";
import OrderHistory from "../pages/OrderHistory";
import OrderHistoryAdmin from "../pages/OrderHistoryAdmin";
import { API, getAllProducts } from "../../api";
import Checkout from "../pages/Checkout";
import { Sidebar } from "lucide-react";

const AppRoutes = ({ user, categories }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading && !categories) {
    return (
      <div className="flex justify-center items-center w-[100wh] h-[100vh]">
        <span className="loader"></span>
      </div>
    );
  }
  return (
    categories && (
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<Home user={user} categories={categories} />}
        />
        <Route path={ROUTES.CATEGORY} element={<SingleCategory />} />
        <Route path={ROUTES.PRODUCT} element={<SingleProduct />} />
        <Route
          path={ROUTES.SEARCH}
          element={<SearchItems products={products} />}
        />
        <Route path={ROUTES.CHECKOUT} element={<Checkout user={user} />} />
        {user?.admin ? (
          <Route
            path={ROUTES.PROFILE}
            element={<OrderHistoryAdmin orders={orders} />}
          />
        ) : (
          <Route
            path={ROUTES.PROFILE}
            element={<OrderHistory orders={orders} />}
          />
        )}

        <Route path={ROUTES.CART} element={<Cart />} />
      </Routes>
    )
  );
};

export default AppRoutes;
