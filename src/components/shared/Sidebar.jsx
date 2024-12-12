import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../utils/data";

export const Sidebar = () => {
  const [active, setActive] = React.useState();

  return (
    <ul className="flex gap-[5px] items-center justify-between overflow-x-scroll ">
      {CATEGORIES.map(({ name, id }, index) => (
        <li key={id}>
          {active !== index ? (
            <div
              onClick={() => setActive(index)}
              className="bg-primary text-white text-xl font-medium px-3 pt-[10px] pb-[7px] rounded-b-xl"
            >
              <Link to={`/categories/${id}`}>{name}</Link>
            </div>
          ) : (
            <></>
          )}
        </li>
      ))}
    </ul>
  );
};
