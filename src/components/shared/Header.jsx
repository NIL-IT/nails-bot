import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export function Header() {
  return (
    <header className="flex justify-between items-center mt-[29px] mb-[13px]">
      <Link to={ROUTES.HOME}>
        <img src="../../../public/img/logo.svg" alt="ШТУЧКИ.PRO" />
      </Link>
      <div className="flex gap-5 items-center">
        <Link>
          <img src="../../../public/img/search.svg" alt="Поиск" />
        </Link>
        <Link>
          <img src="../../../public/img/account.svg" alt="Личный кабинет" />
        </Link>
      </div>
    </header>
  );
}
