import React from "react";
import { Title } from "../ui";

export function Product({ item }) {
  return (
    <article className="p-[6px] flex flex-col gap-[10px] bg-gray rounded-[10px] w-[145px]">
      <div className=" flex justify-center">
        <img
          className="rounded-[10px] w-[89px] object-scale-down"
          src={item.img}
          alt={item.title}
        />
      </div>
      <div>
        <Title text={item.title} size={"text-2xl"} />
        <div className="text-base font-medium">
          <p>{item.desc}</p>
          <p>{item.volume}</p>
        </div>
      </div>
      <div className="text-2xl font-semibold mb-1">{item.price} ₽</div>
    </article>
  );
}
