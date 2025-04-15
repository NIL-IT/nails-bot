import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { useDispatch } from "react-redux";
import {
  changeCurrentCategory,
  changePositionSidebar,
} from "../../features/slice/userSlice";

export function Header() {
  const params = useLocation();
  const dispatch = useDispatch();
  const isSearch = params.pathname === "/search";

  return !isSearch ? (
    <header className="flex justify-between items-center mt-[29px] mb-[13px]">
      <Link
        onClick={() => {
          dispatch(changeCurrentCategory(null));
          dispatch(changePositionSidebar(0));
        }}
        to={ROUTES.HOME}
      >
        <img src="/img/logo.svg" alt="ШТУЧКИ.PRO" />
      </Link>
      <div className="flex gap-5 items-center">
        <Link to={ROUTES.SEARCH}>
          <img src="/img/search.svg" alt="Поиск" />
        </Link>
        <Link to={ROUTES.PROFILE}>
          <img src="/img/account.svg" alt="Личный кабинет" />
        </Link>
      </div>
    </header>
  ) : (
    <></>
  );
}
