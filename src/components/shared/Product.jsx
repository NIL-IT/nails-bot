import React from "react";
import { Title } from "../ui";

export function Product({ item }) {
  const children = item?.children ? item.children : item;
  return (
    <article className="p-[6px] flex flex-col gap-[10px] bg-gray rounded-[10px] w-[145px]">
      <div className=" flex justify-center w-[89px] h-[89px]">
        <img
          className="rounded-[10px] w-[89px] object-scale-down"
          src={`${children.detail_picture}`}
          alt={children.name}
        />
      </div>
      <div>
        <Title text={children.name} size={"text-2xl"} />
        <div className="text-base font-medium">
          <p>{children.desc}</p>
          <p>{children.volume}</p>
        </div>
      </div>
      <div className="text-2xl font-semibold mb-1">{children.base_price} ₽</div>
    </article>
  );
}
