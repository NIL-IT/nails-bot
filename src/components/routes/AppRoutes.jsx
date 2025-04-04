import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { ROUTES } from "./routes";
import SingleProduct from "../pages/SingleProduct";
import SingleCategory from "../pages/SingleCategory";
import Cart from "../pages/Cart";
import SearchItems from "../pages/SearchItems";
import OrderHistory from "../pages/OrderHistory";
import OrderHistoryAdmin from "../pages/OrderHistoryAdmin"; // Admin version of OrderHistory

const AppRoutes = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const baseURL = "https://nails.nilit2.ru:8000/catalog.php/";
  const API = {
    // Получение данных пользователя
    getUser: async (id_tg) => {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_tg }),
      };

      return fetch(`${baseURL}get_user.php`, option)
        .then((res) => res.json())
        .catch((err) => {
          console.error("API request error:", err);
          return { success: false };
        });
    },

    // Получение категорий
    getCategories: async () => {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          type: "category",
          id: "NULL",
        }),
      };

      return fetch(`${baseURL}index.php`, option)
        .then((res) => res.json())
        .catch((err) => {
          console.error("API request error:", err);
          return [];
        });
    },

    // Получение продуктов
    getProducts: async () => {
      const option = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      return fetch(`${baseURL}index.php`, option)
        .then((res) => res.json())
        .catch((err) => {
          console.error("API request error:", err);
          return [];
        });
    },

    // Получение заказов пользователя
    getOrders: async (userId) => {
      const option = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      return fetch(`${baseURL}get_orders.php?user_id=${userId}`, option)
        .then((res) => res.json())
        .catch((err) => {
          console.error("API request error:", err);
          return [];
        });
    },
  };

  const fetchCategories = async () => {
    const categoriesData = await API.getCategories();
    setCategories(categoriesData);
  };

  const fetchProducts = async () => {
    const productsData = await API.getProducts();
    setProducts(productsData);
  };

  const fetchOrders = async () => {
    if (user?.id) {
      const ordersData = await API.getOrders(user.id);
      setOrders(ordersData);
    }
  };

  useEffect(() => {
    fetchCategories();
    // fetchProducts();
    // fetchOrders();
  }, [user]);

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PRODUCT} element={<SingleProduct />} />
      <Route path={ROUTES.CATEGORY} element={<SingleCategory />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.SEARCH} element={<SearchItems />} />

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
      )}
    </Routes>
  );
};

export default AppRoutes;
