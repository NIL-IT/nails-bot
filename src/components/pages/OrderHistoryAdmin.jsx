import React, { useState } from "react";
import { Button, Title } from "../ui";
import { normal } from "../../utils/constants";
import { USERS } from "../../utils/data";
import OrderUser from "../shared/OrderUser";
import { CalendarDemo } from "../shared/Calendar";
export default function OrderHistoryAdmin() {
  const [isCalendar, setIsCalendar] = useState(false);
  const setActiveCalendar = () => setIsCalendar(!isCalendar);

  return (
    <div className="mb-[30px]">
      <Title text={"История заказов"} />
      <Button
        onClick={setActiveCalendar}
        text={"Выберите дату"}
        type={normal}
        className={"w-[100%] bg-secondary mt-[10px] mb-[30px]"}
      />
      {isCalendar && <CalendarDemo setIsCalendar={setActiveCalendar} />}
      <div className="mt-5">
        {USERS.map(({ orders, id }) => (
          <OrderUser key={id} orders={orders} />
        ))}
      </div>
    </div>
  );
}
