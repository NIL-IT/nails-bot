import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes";
import { Container, Header, Sidebar } from "./components/shared";
import { Button } from "./components/ui";

function App() {
  const [user, setUser] = useState<any | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [restaurantAddress, setRestaurantAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin] = useState(true); 
  const restaurantId = window.location.pathname.split("/")[1];

  const location = useLocation();

  const baseURL = "https://testingnil7.ru:8000/";

  // Функция получения данных пользователя
  const fetchUserData = async () => {
    try {
      const tg = window.Telegram.WebApp;
      tg.expand();
      const userId = tg.initDataUnsafe.user.id;
      const userResponse = await API.getUser(userId, restaurantId);

      if (userResponse && userResponse.success && userResponse.user) {
        setUser(userResponse.user);
        setRestaurantName(userResponse.restaurant_name);
        setRestaurantAddress(userResponse.restaurant_address);
      } else {
        console.error("User not found.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [restaurantId]);

  // API запросы
  const API = {
    getUser: async (id, restaurantId) => {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, restaurantId }),
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
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Container>
      <Header />
      <Sidebar />
      <AppRoutes user={user} />
    </Container>
  );
}

export default App;