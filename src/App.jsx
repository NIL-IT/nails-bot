import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes";
import { Container, Header } from "./components/shared";
import BackButton from "./components/ui/BackButton";
import { getAllCart } from "./utils/cart";
import { useDispatch } from "react-redux";
import { recoveryAllCart } from "./features/slice/userSlice";

function App() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin] = useState(true); // Логика для администратора
  const restaurantId = window.location.pathname.split("/")[1];

  const location = useLocation();

  const baseURL = "https://nails.nilit2.ru:8000/";

  // Функция получения данных пользователя
  const fetchUserData = async () => {
    if (Object.hasOwn(window, "Telegram")) {
      try {
        const tg = window.Telegram.WebApp;
        tg.expand();
        const userId = tg.initDataUnsafe.user.id;
        const username = tg.initDataUnsafe.user.username;
        const userResponse = await API.getUser(userId, username); 
  
        if (userResponse && userResponse.success && userResponse.user) {
          setUser(userResponse.user);
          setIsLoading(false);
        } else {
          console.error("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [restaurantId]);

  // API запросы
  const API = {
    getUser: async (id_tg, username) => {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_tg, username }), // Добавлено поле username
      };
  
      return fetch(`${baseURL}get_user.php`, option)
        .then((res) => res.json())
        .catch((err) => {
          console.error("API request error:", err);
          return { success: false };
        });
    },
  };

  // Если данные еще загружаются, показываем индикатор загрузки

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center w-[100wh] h-[100vh]">
  //       <span className="loader"></span>
  //     </div>
  //   );
  // }
  // Восстановение корзины
  useEffect(() => {
    dispatch(recoveryAllCart(getAllCart()));
  }, []);
  return (
    <Container>
      <Header />

      {Object.hasOwn(window, "Telegram") && <BackButton />}
      <AppRoutes user={user} />
    </Container>
  );
}

export default App;
