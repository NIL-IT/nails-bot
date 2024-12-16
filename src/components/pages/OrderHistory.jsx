import React from "react";
import { Button, Title } from "../ui";
import { USERS } from "../../utils/data";
import OrderItem from "../shared/OrderItem";
import { normal } from "../../utils/constants";

export default function OrderHistory() {
  return (
    <div className="mb-[30px]">
      <Title text="Заказ от 10.10.24" />
      <div className="mt-5 flex flex-col gap-[10px]">
        {USERS[0].orders[0].items.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}
      </div>
      <Button
        text="Повторный заказ"
        type={normal}
        className={"w-[100%] bg-secondary mt-5"}
      />
    </div>
  );
}
