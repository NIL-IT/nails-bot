import { ArrowLeft, Ban, CheckCircle, ShoppingBag } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import Cookies from "js-cookie";
import { baseURL } from "../../api";
export default function Succes() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get("succes");
  const isSucces = paramValue == "true";
  const verifyPayment = async (id) => {
    try {
      const fetchPayment = await fetch(`${baseURL}payment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verify_payment",
          payment_id: id,
        }),
      });
      const dataFetchPayment = await fetchPayment.json();
      console.log("dataFetchPayment", dataFetchPayment);
      Cookies.remove("payment_id");
      localStorage.removeItem("payment_id");
      sessionStorage.removeItem("payment_id");
      return dataFetchPayment;
    } catch (err) {
      Cookies.remove("payment_id");
      localStorage.removeItem("payment_id");
      sessionStorage.removeItem("payment_id");
      console.log(err);
    }
  };
  useEffect(() => {
    const cookieData = Cookies.get("payment_id");
    if (cookieData) {
      verifyPayment(cookieData);
      return;
    }
    const sessionData = sessionStorage.getItem("payment_id");
    if (sessionData) {
      verifyPayment(sessionData);
      return;
    }
    const localData = localStorage.getItem("payment_id");
    if (localData) {
      verifyPayment(localData);
      return;
    }
  }, []);
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
