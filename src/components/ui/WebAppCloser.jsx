import { useEffect } from "react";

const WebAppCloser = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      // Настраиваем поведение закрытия
      Telegram.WebApp.setupClosingBehavior({
        need_confirmation: true, // Показывать подтверждение перед закрытием
      });

      // Очистка при размонтировании
      return () => {
        Telegram.WebApp.setupClosingBehavior({
          need_confirmation: false, // Отключаем подтверждение
        });
      };
    }
  }, []);

  return null;
};

export default WebAppCloser;
