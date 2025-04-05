import { AirVent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { changeCurrentCategory } from "../../features/slice/userSlice";

export const Sidebar = ({ categories }) => {
  const { id } = useParams();
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const [active, setActive] = useState(categories ? categories[0].id : null);
  useEffect(() => {
    if (!id) return;
    if (pathname.split("/")[1] === "products") return;
  }, [id]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [hasDragged, setHasDragged] = React.useState(false);
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
    setHasDragged(true); // добавляем
    e.preventDefault();
    const x = e.pageX - sidebarRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sidebarRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 0); // сбрасываем на следующий тик
  };
  const handleClickLink = (e, id) => {
    // Добавлен параметр e
    if (hasDragged) {
      e.preventDefault();
      return;
    }
    setActive(id);
    dispatch(changeCurrentCategory(id));
  };
  console.log(" sidebar categories", categories);
  return (
    categories && (
      <ul
        ref={sidebarRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-[5px]  justify-between overflow-x-scroll mb-[30px]"
      >
        {categories.map(({ name, id }) => (
          <li key={id}>
            <Link onClick={(e) => handleClickLink(e, id)} draggable={false}>
              <div
                className={`no-select bg-primary
               text-white text-xl font-medium px-3 pt-[10px] pb-[7px] rounded-b-xl ${
                 active !== id ? "pt-[10px]" : "pt-[20px]"
               }`}
              >
                {name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  );
};
