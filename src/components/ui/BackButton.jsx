import { useEffect } from "react";

const BackButton = () => {
  const goBack = () => {
    if (window.Telegram?.WebApp?.isExpanded) {
      console.log("window.Telegram?.WebApp?.isExpanded");
      Telegram.WebApp.close(); // Закрыть WebView полностью
    } else {
      console.log(window.location.href.includes("web"));
      window.history.back(); // Попробовать вернуться назад (если внутри мини-приложения)
    }
  };

  useEffect(() => {
    if (!window.Telegram?.WebApp) return;

    Telegram.WebApp.BackButton.onClick(goBack);
    Telegram.WebApp.BackButton.show();

    return () => {
      Telegram.WebApp.BackButton.offClick(goBack);
      Telegram.WebApp.BackButton.hide();
    };
  }, []);

  return null;
};

export default BackButton;
