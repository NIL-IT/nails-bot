import React, { useEffect, useState } from "react";
import { Button, Title } from "../ui";
import { PRODUCTS, USERS } from "../../utils/data";
import OrderItem from "../shared/OrderItem";
import { normal } from "../../utils/constants";
import { useSortedOrdersUser } from "../../hooks/useSortedOrdersUser";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../features/slice/userSlice";
import { ROUTES } from "../routes/routes";
import { API, baseURL } from "../../api";

export default function OrderHistory({ user }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const fetchOrders = async () => {
    try {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "user",
          id_tg_user: user?.id_tg || 792820756,
        }),
      };
      const resp = await fetch(`${baseURL}get_orders.php`, option);
      const { data } = await API.parseResponse(resp);
      setData(useSortedOrdersUser(data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const dispatch = useDispatch();
  const addItem = async (items) => {
    for (let item of items) {
      const fetchProduct = await API.getProduct(item.id);
      dispatch(
        addItemToCart({ ...fetchProduct.data[0], quantity: item.quantity })
      );
    }
  };
  return loading ? (
    <></>
  ) : data.length > 0 ? (
    <div className="mb-[30px]">
      {data.map((order, index) => (
        <div key={index}>
          <Title
            text={`Заказ от ${order.time
              .split(" ")[0]
              .split("-")
              .reverse()
              .join("-")}`}
            className={"mt-[30px]"}
          />
          <div className="mt-5 flex flex-col gap-[10px]">
            {order.products.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
          <div onClick={() => addItem(order.products)}>
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
  ) : (
    <div className="h-[70vh] flex flex-col justify-center items-center   text-center">
      <div className="w-[200px] h-[200px]">
        <img width={200} src="/img/nofaund.png" alt="" />
      </div>
      <div className="font-montserrat text-center flex flex-col gap-0">
        <p className="text-[18px]">Заказов нет</p>
      </div>
      <div className="w-[80%]">
        <Button
          text={"Перейти в каталог"}
          type={normal}
          to={ROUTES.HOME}
          className={"w-[80%] bg-secondary mt-[20px] mb-[30px]"}
        />
      </div>
    </div>
  );
}
