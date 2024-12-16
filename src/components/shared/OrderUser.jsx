import React from "react";

import OrderItemList from "./OrderItemList";
import { useGetDate } from "../../hooks/useGetDate";
import { Title } from "../ui";

export default function OrderUser({ orders }) {
  const { getMonth, year } = useGetDate(orders[0].date);
  return (
    <div className="w-[100%] mb-[20px]">
      <Title text={`${getMonth} ${year}`} className={"mb-5"} />
      <Title
        text={`Заказы от ${orders[0].date}`}
        className={"mb-5 text-primary"}
      />
      {orders.map((order) => (
        <OrderItemList key={order.id} order={order} />
      ))}
    </div>
  );
}
