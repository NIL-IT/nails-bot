import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Header, Sidebar } from "./components/shared";
import AppRoutes from "./components/routes/AppRoutes";
import { API } from "./api";
import { recoveryAllCart } from "./features/slice/userSlice";
import { getAllCart } from "./utils/cart";
import { ROUTES } from "./components/routes/routes";
import { useLocation } from "react-router-dom";
import BackButton from "./components/ui/BackButton";
function App() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const restaurantId = window.location.pathname.split("/")[1];
  const [categories, setCategories] = useState([]);
  const { pathname } = useLocation();
  const [showSidebar, setShowSidebar] = useState(null);
  // Combined data fetching in a single useEffect
  useEffect(() => {
    const abortController = new AbortController();

    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        // Fetch user data if Telegram is available
        if (Object.hasOwn(window, "Telegram")) {
          const tg = window.Telegram.WebApp;
          tg.expand();
          const userId = tg.initDataUnsafe.user.id;
          const username = tg.initDataUnsafe.user.username;

          const userResponse = await API.getUser(userId, username);

          if (userResponse && userResponse.success && userResponse.user) {
            setUser(userResponse.user);
          } else {
            console.error("User not found.");
          }
        }

        // Fetch categories
        const categoriesResponse = await API.getCategories();
        if (categoriesResponse && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    // Cleanup function to abort fetch on unmount
    return () => abortController.abort();
  }, [restaurantId]); // Only re-run if restaurantId changes

  // Cart recovery effect
  useEffect(() => {
    dispatch(recoveryAllCart(getAllCart()));
  }, [dispatch]);
  useEffect(() => {
    let isShow =
      (pathname === ROUTES.PROFILE && user?.admin) ||
      pathname === ROUTES.SEARCH ||
      pathname === ROUTES.CART ||
      pathname === ROUTES.CHECKOUT;
    setShowSidebar(isShow);
  }, [pathname]);
  console.log("user", user);
  return (
    <Container>
      <Header />
      {categories.length > 0 && !showSidebar && (
        <Sidebar categories={categories} />
      )}
      {Object.hasOwn(window, "Telegram") && <BackButton />}
      <AppRoutes categories={categories} user={user} />
    </Container>
  );
}

export default App;
