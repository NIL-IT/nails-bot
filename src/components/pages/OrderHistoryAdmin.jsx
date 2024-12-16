import React from "react";
import { Button, Title } from "../ui";
import { normal } from "../../utils/constants";
import { USERS } from "../../utils/data";

import OrderUser from "../shared/OrderUser";

export default function OrderHistoryAdmin() {
  return (
    <div className="mb-[30px]">
      <Title text={"История заказов"} />
      <Button
        text={"Выберите дату"}
        type={normal}
        className={"w-[100%] bg-secondary mt-[10px] mb-[30px]"}
      />
      <div>
        {USERS.map(({ orders, id }) => (
          <OrderUser key={id} orders={orders} />
        ))}
      </div>
    </div>
  );
}
