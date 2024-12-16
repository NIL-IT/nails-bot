import React, { useEffect } from "react";

export default function OrderItemList({ item, changeSum, currentItem }) {
  useEffect(() => {
    changeSum(currentItem(item.id).price * item.quantity);
  }, [item]);
  return (
    <>
      <p className="text-gray_dark text-base font-montserrat">{`${
        currentItem(item.id).title
      } ${currentItem(item.id).subtitle}`}</p>
      <div className="flex items-center gap-[10px]">
        <p className="text-primary text-xl font-medium font-montserrat">
          {item.quantity}x
        </p>
        <span className="font-semibold text-2xl font-manrope">
          {`${currentItem(item.id).price * item.quantity}`}₽
        </span>
      </div>
    </>
  );
}
