import React, { useEffect, useState } from "react";
import { Title } from "../ui";
import { PRODUCTS } from "../../utils/data";

export default function OrderItem({ item }) {
  const { id, quantity } = item;
  const [list, setList] = useState([]);
  const { title, subtitle, desc, volume, price } = list;
  useEffect(() => {
    if (!id && !item) return;
    setList(PRODUCTS.find((item) => item.id === id));
  }, [id]);
  return (
    <div className="bg-gray py-2 px-[6px] w-[100%] flex flex-col justify-between gap-[5px]">
      <div>
        <Title text={title} size={"2xl"} />
        <Title text={subtitle} size={"2xl"} />
      </div>
      <div className="flex justify-between items-end">
        <p className="text-base font-montserrat text-gray_dark ">
          {desc}&nbsp;{volume}
        </p>
        <div className="flex gap-[7px] items-center justify-between w-[60px]">
          <p className="text-primary text-xl font-medium font-montserrat">
            {quantity}x
          </p>
          <span className="font-semibold text-2xl font-manrope">
            {price * quantity}₽
          </span>
        </div>
      </div>
    </div>
  );
}
