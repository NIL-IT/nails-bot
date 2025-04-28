import React, { useEffect } from "react";
import { Button, Title } from "../ui";
import { PRODUCTS, USERS } from "../../utils/data";
import OrderItem from "../shared/OrderItem";
import { normal } from "../../utils/constants";
import { useSortedOrdersUser } from "../../hooks/useSortedOrdersUser";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../features/slice/userSlice";
import { ROUTES } from "../routes/routes";
import { baseURL } from "../../api";

export default function OrderHistory({ user }) {
  const fetchOrders = async () => {
    try {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "user",
          id_tg_user: toString(user?.id_tg) || 1,
        }),
      };
      const resp = await fetch(`${baseURL}get_orders.php`, option);
      const data = await resp.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const dispatch = useDispatch();
  const addItem = (items) => {
    for (let i = 0; i < items.length; i++) {
      let product = PRODUCTS.filter((item) => item.id === items[i].id);
      let item = product[0];
      dispatch(addItemToCart({ ...item, quantity: items[i].quantity }));
    }
  };
  return (
    <div className="mb-[30px]">
      {useSortedOrdersUser(USERS[0]).map((order, index) => (
        <div key={index}>
          <Title text={`Заказ от ${order.date}`} className={"mt-[30px]"} />
          <div className="mt-5 flex flex-col gap-[10px]">
            {order.items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
          <div onClick={() => addItem(order.items)}>
            <Button
              to={ROUTES.CART}
              text="Повторный заказ"
              type={normal}
              className={"w-[100%] bg-secondary mt-5"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
