import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { ROUTES } from "../routes/routes";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправляем на страницу истории заказов через 3 секунды
    const redirectTimer = setTimeout(() => {
      navigate(ROUTES.PROFILE);
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col justify-center items-center">
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-[#9bd79b]/20 p-3">
              <CheckCircle className="h-16 w-16 text-[#008000]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black/80 mb-2">
              Заказ успешно создан!
            </h1>
            <p className="text-gray_dark">Спасибо за ваш заказ.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
