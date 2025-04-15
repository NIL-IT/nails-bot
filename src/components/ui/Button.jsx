import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  basket,
  quantity,
  normal,
  outline,
  minus,
  plus,
} from "../../utils/constants";
import { ROUTES } from "../routes/routes";
import { Minus, Plus } from "lucide-react";
const cn = (...classes) => classes.filter(Boolean).join(" ");
export function Button({
  type,
  text,
  className,
  id,
  count,
  onClick = null,
  handleIncrement,
  classNameIcons,
  to,
}) {
  return type === basket ? (
    <button
      className={clsx(`rounded-[10px] bg-primary px-5 py-[9px]`, className)}
    >
      <Link
        to={ROUTES.CART}
        className="text-white text-2xl font-manrope font-semibold"
      >
        {text}
      </Link>
    </button>
  ) : type === outline ? (
    <>
      <Link to={`/categories/${id}`}>
        <button className=" rounded-[10px] border border-primary px-[10px] py-[7px]">
          <div className="flex items-center gap-[5px]">
            <span className="text-primary text-base font-montserrat">
              {text}
            </span>
            <img src="./img/arrow-right.svg" alt="arrow-right" />
          </div>
        </button>
      </Link>
    </>
  ) : type === normal ? (
    <button
      onClick={onClick ? () => onClick() : () => {}}
      className={clsx(`rounded-[10px] bg-primary  py-[9px]`, className)}
    >
      <Link
        to={to ? to : ""}
        className="text-white text-2xl font-manrope font-semibold"
      >
        {text}
      </Link>
    </button>
  ) : type === quantity ? (
    <div
      className={clsx(
        `flex items-center justify-between border border-primary rounded-[10px]  `,
        className
      )}
    >
      <button
        onClick={() => handleIncrement(minus, id)}
        className={cn(
          "min-w-[30%] min-h-[20px] flex flex-col items-end justify-center py-2 px-2",
          classNameIcons
        )}
      >
        <Minus size={12} color="#dc46a0" />
      </button>

      <span className="text-primary text-xl font-montserrat font-medium">
        {count}
      </span>
      <button
        onClick={() => handleIncrement(plus, id)}
        className={cn(
          "min-w-[30%] min-h-[20px] flex flex-col items-start justify-center py-2 px-2",
          classNameIcons
        )}
      >
        <Plus size={12} color="#dc46a0" />
      </button>
    </div>
  ) : (
    <></>
  );
}
