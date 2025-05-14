import { ArrowLeft, Ban, CheckCircle, ShoppingBag } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export default function Succes() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get("succes");
  const isSucces = paramValue == "true";

  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col justify-center items-center">
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="w-full">
          {/* Success animation */}
          <div className="flex justify-center mb-6">
            {isSucces ? (
              <div className="rounded-full bg-[#9bd79b]/20 p-3">
                <CheckCircle className="h-16 w-16 text-[#008000]" />
              </div>
            ) : (
              <div className="rounded-full bg-[#da2929]/5 p-3">
                <Ban className="h-16 w-16 text-[#da2929]" />
              </div>
            )}
          </div>

          {/* Success message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black/80 mb-2">
              {isSucces
                ? "Оплата прошла успешно!"
                : "Произошла ошибка при оплате"}
            </h1>
            <p className="text-gray_dark">
              {" "}
              {isSucces
                ? "Спасибо за ваш заказ."
                : "Через некоторое время попробуйте снова"}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Link to={ROUTES.HOME} className="block w-full">
            <button className="w-full bg-primary rounded-xl py-2 px-4 flex items-center text-white">
              <ShoppingBag className="mr-3 h-4 w-4" />
              Продолжить покупки
            </button>
          </Link>
          <Link to={ROUTES.PROFILE} className="block w-full">
            <button className="w-full bg-primary rounded-xl py-2 px-4 flex justify-center items-center text-white text-center">
              <ArrowLeft className="mr-3 h-4 w-4" />
              Мои заказы
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
