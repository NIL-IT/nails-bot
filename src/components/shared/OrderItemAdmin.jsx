import React, { useState } from "react";
import { Title } from "../ui";
import { PRODUCTS, USERS } from "../../utils/data";
import OrderItemList from "./OrderItemList";
const name = USERS[0].name;
export default function OrderItemAdmin({ orders }) {
  const currentItem = (id) => PRODUCTS.find((item) => item.id === id);
  const [sum, setSum] = useState(0);
  const changeSum = (price) => {
    setSum(sum + price);
  };
  return (
    <div className="w-[100%] ">
      {orders.map((order, index) => (
        <div key={index} className="mb-[10px] bg-gray p-[6px] rounded-[10px]">
          <Title text={`Заказ №${order.number}`} size={"2xl"} />
          <div className="mt-[10px] mb-5 text-base font-montserrat text-gray_dark">
            <p className="mb-[5px]">Имя:&nbsp;{name}</p>
            <p>Время заказа:&nbsp;{order.time}</p>
          </div>
          <div className="flex flex-col gap-[5px]">
            {order.items.map((item, index) => (
              <div className="flex justify-between items-center" key={index}>
                <OrderItemList
                  changeSum={changeSum}
                  currentItem={currentItem}
                  item={item}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-5">
            <p>Общая стоимость заказа</p>
            <span className="font-manrope text-3xl font-semibold">{sum}₽</span>
          </div>
        </div>
      ))}
    </div>
  );
}
