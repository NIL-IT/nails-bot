import { ArrowLeft, Ban, CheckCircle, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import Cookies from "js-cookie";
import { baseURL } from "../../api";

export default function Succes() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get("succes");
  const paramOrderId = urlParams.get("order");
  const isSucces = paramValue == "true";
  const verifyPayment = async (orderId) => {
    if (!orderId) {
      setError("Не удалось получить идентификатор заказа");
      setIsLoading(false);
      return;
    }

    try {
      const fetchVerifyPayment = await fetch(`${baseURL}payment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "get_payment_id",
          order_id: orderId,
        }),
      });
      const responseText = await fetchVerifyPayment.text();
      // Extract the payment ID from the response
      const paymentId = responseText.match(/"(\d+)"/)?.[1];

      if (!paymentId) {
        setError("Не удалось получить идентификатор платежа");
        setIsLoading(false);
        return;
      }

      const fetchPayment = await fetch(`${baseURL}payment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verify_payment",
          payment_id: paymentId,
        }),
      });

      const dataFetchPayment = await fetchPayment.json();
      console.log("dataFetchPayment", dataFetchPayment);
      if (!dataFetchPayment.success) {
        setError(dataFetchPayment.message || "Ошибка при проверке платежа");
      }

      setIsLoading(false);
      return dataFetchPayment;
    } catch (err) {
      console.log(err);
      setError("Произошла ошибка при подключении к серверу");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderId) {
      verifyPayment(paramOrderId);
    } else {
      // Если ни в одном хранилище нет данных
      setError("Идентификатор заказа не найден");
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex flex-col justify-center items-center">
        <div className="flex-1 flex flex-col items-center justify-center p-3">
          <p>Проверка статуса заказа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col justify-center items-center">
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="w-full">
          {/* Отображаем ошибку, если она есть */}
          {error && (
            <div className="mb-6 text-center">
              <div className="rounded-full bg-[#da2929]/5 p-3 inline-block">
                <Ban className="h-16 w-16 text-[#da2929]" />
              </div>
              <h1 className="text-3xl font-bold text-black/80 mb-2 mt-4">
                Ошибка заказа
              </h1>
              <p className="text-gray_dark">{error}</p>
            </div>
          )}

          {/* Показываем стандартное сообщение только если нет ошибки */}
          {!error && (
            <>
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

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black/80 mb-2">
                  {isSucces
                    ? "Оплата прошла успешно!"
                    : "Произошла ошибка при оплате"}
                </h1>
                <p className="text-gray_dark">
                  {isSucces
                    ? "Спасибо за ваш заказ."
                    : "Через некоторое время попробуйте снова"}
                </p>
              </div>
            </>
          )}
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
