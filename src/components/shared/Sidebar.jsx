import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../utils/data";

export const Sidebar = () => {
  return (
    <ul className="flex gap-[5px] items-center justify-between overflow-x-scroll ">
      {CATEGORIES.map(({ name, id }) => (
        <li
          key={id}
          className="bg-primary text-white text-xl font-medium px-3 pt-[10px] pb-[7px] rounded-b-xl"
        >
          <Link to={`/categories/${id}`}>{name}</Link>
        </li>
      ))}
    </ul>
  );
};
