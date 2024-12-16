import React from "react";
import { PRODUCTS } from "../../utils/data";

export default function OrderAdminItem({ item }) {
  const currentItem = (id) => PRODUCTS.find((item) => item.id === id);

  return (
    <div className="flex justify-between items-center">
      <p className="text-gray_dark text-base font-montserrat">{`${
        currentItem(item.id).title
      } ${currentItem(item.id).subtitle}`}</p>
      <div className="flex  justify-between items-center gap-[20px] w-[75px]">
        <p className="text-primary text-xl font-medium font-montserrat">
          {item.quantity}x
        </p>
        <span className="font-semibold text-2xl font-manrope ">
          {`${currentItem(item.id).price * item.quantity}`}₽
        </span>
      </div>
    </div>
  );
}
