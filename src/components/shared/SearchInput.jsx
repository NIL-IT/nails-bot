import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export default function SearchInput({ value, handleSearch, handleSubmit }) {
  return (
    <div className="fixed top-0 left-0 bg-white w-[100%] h-[70px]">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center  py-1 px-4 gap-[10px] 
    rounded-[10px] bg-gray mt-[30px]"
      >
        <img src="./img/searchnobg.svg" alt="search" />
        <input
          value={value}
          onChange={handleSearch}
          placeholder="Поиск..."
          type="text"
          className="w-[100%]"
        />
        <Link className="mr-1" to={ROUTES.HOME}>
          <img src="./img/close.svg" alt="close" className="min-w-5 min-h-5" />
        </Link>
      </form>
    </div>
  );
}
