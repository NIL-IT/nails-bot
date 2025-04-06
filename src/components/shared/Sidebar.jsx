import { AirVent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { changeCurrentCategory } from "../../features/slice/userSlice";

export const Sidebar = ({ categories }) => {
  const { id } = useParams();
  let { pathname } = useLocation();
  const { currentCategory } = useSelector(({ user }) => user);
  console.log("currentCategory", currentCategory);
  const dispatch = useDispatch();
  const [active, setActive] = useState(
    currentCategory ? currentCategory : categories[0].id
  );
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
  return (
    categories && (
      <ul
        ref={sidebarRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-[5px] overflow-x-scroll mb-[30px] whitespace-nowrap"
      >
        {categories.map(({ name, id }) => (
          <li key={id} className="flex-shrink-0">
            <Link
              to={"/"}
              onClick={(e) => handleClickLink(e, id)}
              draggable={false}
            >
              <span
                className={`no-select block bg-primary text-white 
          text-xl font-medium px-3 pt-[10px] pb-[7px] rounded-b-xl 
          ${active !== id ? "pt-[10px]" : "pt-[30px]"}
          whitespace-nowrap`}
              >
                {name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    )
  );
};
