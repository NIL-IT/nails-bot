import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CATEGORIES } from "../../utils/data";

export const Sidebar = () => {
  const { id } = useParams();
  let { pathname } = useLocation();
  const [active, setActive] = React.useState(0);
  useEffect(() => {
    if (!id) return;
    if (pathname.split("/")[1] === "products") return;
    setActive(id);
  }, [id]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const sidebarRef = React.useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sidebarRef.current.offsetLeft);
    setScrollLeft(sidebarRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sidebarRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sidebarRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ul
      ref={sidebarRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="flex gap-[5px]  justify-between overflow-x-scroll mb-[30px]"
    >
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
