import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { basket, normal, outline } from "../../utils/constants";
export function Button({ type, text, className, id }) {
  return type === basket ? (
    <button
      className={clsx(`rounded-[10px] bg-primary px-5 py-[9px]`, className)}
    >
      <Link className="text-white text-2xl font-manrope font-semibold">
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
  ) : (
    <button className={clsx(`rounded-[10px] bg-primary  py-[9px]`, className)}>
      <Link className="text-white text-2xl font-manrope font-semibold">
        {text}
      </Link>
    </button>
  );
}
