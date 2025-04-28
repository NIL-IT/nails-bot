import React, { useEffect, useState } from "react";
import { Title } from "../ui";
import { PRODUCTS } from "../../utils/data";

export default function OrderItem({ item }) {
  return (
    <div className="bg-gray py-2 px-[6px] w-[100%] flex items-end  justify-between gap-[5px]">
      <div className="w-[60%]">
        <Title text={item.name} size={"2xl"} />
      </div>
      <div className="flex gap-[7px] items-center  w-[60px]">
        <p className="text-primary text-xl font-medium font-montserrat">
          {item.quantity}x
        </p>
        <span className="font-semibold text-2xl font-manrope">
          {item.base_price * item.quantity}₽
        </span>
      </div>
    </div>
  );
}
