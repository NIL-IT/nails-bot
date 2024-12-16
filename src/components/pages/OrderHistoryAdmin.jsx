import React from "react";
import { Button, Title } from "../ui";
import { normal } from "../../utils/constants";
import { USERS } from "../../utils/data";
import OrderItemAdmin from "../shared/OrderItemAdmin";

export default function OrderHistoryAdmin() {
  console.log(USERS);
  return (
    <div>
      <Title text={"История заказов"} />
      <Button
        text={"Выберите дату"}
        type={normal}
        className={"w-[100%] bg-secondary mt-[10px] mb-[30px]"}
      />
      <div>
        {USERS.map(({ orders, id }) => (
          <OrderItemAdmin key={id} orders={orders} />
        ))}
      </div>
    </div>
  );
}
