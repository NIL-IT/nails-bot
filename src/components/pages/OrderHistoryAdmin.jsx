import React, { useState } from "react";
import { Button, Title } from "../ui";
import { normal } from "../../utils/constants";
import { USERS } from "../../utils/data";

import Calendar from "../shared/Calendar";
import { useSortedOrders } from "../../hooks/useSortedOrders";
import OrdersByMonth from "../shared/OrdersByMonth";
import OrdersByDay from "../shared/OrdersByDay";

export default function OrderHistoryAdmin() {
  const [isCalendar, setIsCalendar] = useState(false);
  const setActiveCalendar = () => setIsCalendar(!isCalendar);
  const sortedOrdersByDate = useSortedOrders(USERS);

  const allOrders = sortedOrdersByDate.flatMap((orders) => orders.orders);
  const [list, setList] = useState(null);
  const resetList = () => setList(null);
  const filterByDate = (date) => {
    setList(allOrders.filter((order) => order.date === date));
  };

  return (
    <div className="mb-[30px]">
      <Title text={"История заказов"} />
      <Button
        onClick={setActiveCalendar}
        text={"Выберите дату"}
        type={normal}
        className={"w-[100%] bg-secondary mt-[10px] mb-[30px]"}
      />
      {isCalendar && (
        <div className="fixed top-0 left-0 w-[100%] h-[100vh] bg-white flex items-center">
          <Calendar
            setActiveCalendar={setActiveCalendar}
            filterByDate={filterByDate}
          />
        </div>
      )}
      {sortedOrdersByDate.length > 0 && list === null ? (
        <div className="mt-5">
          {sortedOrdersByDate.map((orders, index) => (
            <OrdersByMonth key={index} orders={orders} />
          ))}
        </div>
      ) : list.length > 0 ? (
        <div>
          {list.map((item, index) => (
            <OrdersByDay index={index} order={item} key={item.id} />
          ))}
        </div>
      ) : !sortedOrdersByDate.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="font-montserrat">У вас пока нет заказов</p>
          <img width={180} src="/img/nofaund.png" alt="nofaund" />
        </div>
      ) : (
        <div className="h-full flex justify-center flex-col items-center gap-3">
          <div className="text-center">
            <p className="font-montserrat">Заказов в эту дату нет</p>
            <p className="font-montserrat text-base">
              Выберите другую дату или нажмите на отобразить все заказы
            </p>
          </div>
          <img width={180} src="/img/nofaund.png" alt="nofaund" />
          <Button
            type={normal}
            text={"Отобразить все заказы"}
            className={"w-full"}
            onClick={resetList}
          />
        </div>
      )}
    </div>
  );
}
