import React, { useEffect, useState } from "react";

import { Title } from "../ui";
import OrderAdminItem from "./OrderAdminItem";
import { PRODUCTS, USERS } from "../../utils/data";

export default function OrderItemList({ order }) {
  const name = USERS[0].name;
  const [sum, setSum] = useState(0);
  const calcSum = () => {
    let price = 0;
    for (let { id, quantity } of order.items) {
      const currentItem = PRODUCTS.find((item) => item.id === id);
      price += currentItem.price * quantity;
    }
    return price;
  };
  useEffect(() => {
    if (!order) return;
    setSum(calcSum());
  }, [order]);

  return (
    <div className="mb-[10px] bg-gray p-[6px] rounded-[10px]">
      <Title text={`Заказ №${order.number}`} size={"2xl"} />
      <div className="mt-[10px] mb-5 text-base font-montserrat text-gray_dark">
        <p className="mb-[5px]">Имя:&nbsp;{name}</p>
        <p>Время заказа:&nbsp;{order.time}</p>
      </div>
      <div className="flex flex-col gap-[5px]">
        {order.items.map((item) => (
          <OrderAdminItem item={item} key={item.id} />
        ))}
      </div>
      <div className="flex justify-between items-center mt-5">
        <p>Общая стоимость заказа</p>

        <span className="font-manrope text-3xl font-semibold">{sum}₽</span>
      </div>
    </div>
  );
}
