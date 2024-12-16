import React from "react";

import OrderItemList from "./OrderItemList";

export default function OrderUser({ orders }) {
  return (
    <div className="w-[100%] ">
      {orders.map((order) => (
        <OrderItemList key={order.id} order={order} />
      ))}
    </div>
  );
}
