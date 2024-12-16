import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CATEGORIES } from "../../utils/data";

export const Sidebar = () => {
  const { id } = useParams();
  const [active, setActive] = React.useState(0);
  useEffect(() => {
    if (!id) return;
    setActive(id);
  }, [id]);

  return (
    <ul className="flex gap-[5px]  justify-between overflow-x-scroll mb-[30px]">
      {CATEGORIES.map(({ name, id }, index) => (
        <li key={id}>
          {active - 1 !== index ? (
            <div className="bg-primary text-white text-xl font-medium px-3 pt-[10px] pb-[7px] rounded-b-xl">
              <Link to={`/categories/${id}`}>{name}</Link>
            </div>
          ) : (
            <>
              <div className="bg-primary text-white text-xl font-medium px-3 pt-[20px] ] pb-[7px] rounded-b-xl">
                <Link to={`/categories/${id}`}>{name}</Link>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};
