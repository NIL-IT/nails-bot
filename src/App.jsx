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

  const baseURL = "https://nails-bot.nilit1.ru:8000/";


  const fetchUserData = async () => {
    try {
      const tg = window.Telegram.WebApp;
      tg.expand();
      const userId = tg.initDataUnsafe.user.id;
      const userResponse = await API.getUser(userId);

      if (userResponse && userResponse.success && userResponse.user) {
        setUser(userResponse.user);
        setIsLoading(false);
      } else {
        console.error("User not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [restaurantId]);


  const API = {
    getUser: async (id_tg) => {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_tg }),
      };

      return fetch(`${baseURL}get_user.php`, option)
        .then((res) => res.json())
        .catch((err) => {
          console.error("API request error:", err);
          return { success: false };
        });
    },
  };

 
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center w-[100wh] h-[100vh]">
  //       <span className="loader"></span>
  //     </div>
  //   );
  // }

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
