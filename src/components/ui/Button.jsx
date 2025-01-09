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
          "min-w-[35%] min-h-[20px] flex flex-col items-end justify-center",
          classNameIcons
        )}
      >
        <svg
          width="4"
          height="2"
          viewBox="0 0 4 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path d="M0.684 1.204V0.208H3.912V1.204H0.684Z" fill="#DC46A0" />
        </svg>
      </button>

      <span className="text-primary text-xl font-montserrat font-medium">
        {count}
      </span>
      <button
        onClick={() => handleIncrement(plus, id)}
        className={cn(
          "min-w-[35%] min-h-[20px] flex flex-col items-start justify-center",
          classNameIcons
        )}
      >
        <svg
          width="7"
          height="6"
          viewBox="0 0 7 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2"
        >
          <path
            d="M2.988 5.428V0.172H3.996V5.428H2.988ZM0.804 3.28V2.332H6.18V3.28H0.804Z"
            fill="#DC46A0"
          />
        </svg>
      </button>
    </div>
  ) : (
    <></>
  );
}
