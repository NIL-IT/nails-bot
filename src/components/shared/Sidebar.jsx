import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = ({ items }) => {
  return (
    <ul className="flex gap-[5px] items-center justify-between overflow-x-scroll ">
      {items.map((item, i) => (
        <li
          key={i}
          className="bg-primary text-white text-xl font-medium px-3 pt-[10px] pb-[7px] rounded-b-xl"
        >
          <Link>{item}</Link>
        </li>
      ))}
    </ul>
  );
};
