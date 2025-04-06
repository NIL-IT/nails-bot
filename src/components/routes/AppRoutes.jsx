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

const AppRoutes = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false);
  useEffect(() => {
    const abortController = new AbortController(); // Создаем контроллер для отмены
    if (dataFetchedRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const getCategories = await API.getCategories();
        setCategories(getCategories.data);
        console.log(getCategories.data);
        // const categoriesResponse = await API.getCategories({
        //   signal: abortController.signal,
        // }); // Передаем сигнал
        // const allProducts = await getAllProducts(categoriesResponse.data);
        // setCategories((prev) => {
        //   if (prev.length === 0 && allProducts.length > 0) return allProducts;
        //   return prev;
        // });
        dataFetchedRef.current = true;
      } catch (error) {
        if (error.name !== "AbortError") console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!categories.length) fetchData();

    return () => abortController.abort(); // Отменяем запрос при размонтировании
  }, [user]);

  if (loading && !categories) {
    return <div className="loading">Loading categories and products...</div>;
  }
  return (
    categories?.length && (
      <Routes>
        <Route path={ROUTES.HOME} element={<Home categories={categories} />} />
        <Route
          path={ROUTES.CATEGORY}
          element={<SingleCategory categories={categories} />}
        />
        <Route
          path={ROUTES.PRODUCT}
          element={<SingleProduct categories={categories} />}
        />
        <Route
          path={ROUTES.SEARCH}
          element={<SearchItems products={products} />}
        />
        {/* 
       
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route
          path={ROUTES.SEARCH}
          element={<SearchItems products={products} />}
        />
        {user?.isAdmin ? (
          <Route
            path={ROUTES.PROFILE}
            element={<OrderHistoryAdmin orders={orders} />}
          />
        ) : (
          <Route
            path={ROUTES.PROFILE}
            element={<OrderHistory orders={orders} />}
          />
        )} */}
      </Routes>
    )
  );
};

export default AppRoutes;
