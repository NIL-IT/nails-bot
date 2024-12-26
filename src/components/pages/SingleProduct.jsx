import React, { useEffect } from "react";
import { Button, Title } from "../ui";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../utils/data";
import { Sidebar } from "../shared";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../features/slice/userSlice";
import { minus, quantity } from "../../utils/constants";
import { NotificationPopup } from "../shared/NotificationPopup";

export default function SingleProduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const product = PRODUCTS.filter((item) => item.id === parseInt(id))[0];
  const [count, setCount] = React.useState(1);
  const singleProduct = product;
  const [cartItems, setCartItems] = React.useState(singleProduct);
  const handleIncrement = (variant) => {
    if (variant === minus) {
      setCount(count > 1 ? count - 1 : count);
    } else setCount(count + 1);
  };
  const addItem = () => {
    dispatch(addItemToCart({ ...singleProduct, quantity: count }));
    handleCartPopupClose(false);

    const setCookie = (name, value, days) => {
      const expires = new Date(Date.now() + days * 86400000).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(
        value
      )}; expires=${expires}; path=/`;
    };
    const getCookie = (name) => {
      const matches = document.cookie.match(
        new RegExp(
          `(?:^|; )${name.replace(/([$?*|{}()[\\]\\+^])/g, "\\$1")}=([^;]*)`
        )
      );
      return matches ? decodeURIComponent(matches[1]) : null;
    };

    // Load cart from cookies on initial render
    const cartFromCookie = getCookie(`cart_${cartItems.id}`);
    if (cartFromCookie) {
      setCartItems(JSON.parse(cartFromCookie));
    } else {
      const cartFromLocalStorage = localStorage.getItem(`cart_${cartItems.id}`);
      if (cartFromLocalStorage) {
        setCartItems(JSON.parse(cartFromLocalStorage));
      } else {
        const cartFromSessionStorage = sessionStorage.getItem(
          `cart_${cartItems.id}`
        );
        if (cartFromSessionStorage) {
          setCartItems(JSON.parse(cartFromSessionStorage));
        }
      }
    }
    // Save cart to cookies whenever cartItems changes
    const cartData = JSON.stringify({ ...cartItems, quantity: count });

    setCookie(`cart_${singleProduct.id}`, cartData, 7); // cookies на 7 дней
    localStorage.setItem(`cart_${singleProduct.id}`, cartData);
    sessionStorage.setItem(`cart_${singleProduct.id}`, cartData);
  };

  const [showNotification, setShowNotification] = React.useState(false);

  const handleCartPopupClose = (open) => {
    if (!open) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
  };

  return (
    <div>
      <NotificationPopup
        isVisible={showNotification}
        message={"Товар добавлен в корзину"}
      />
      <Sidebar />
      <div className="flex flex-col gap-5 overflow-scroll mb-[90px]">
        <div className="flex justify-center ">
          <div className="w-[171px] h-[171px] ">
            <img
              className="h-[171px] w-[171px] "
              src={singleProduct.img}
              alt={singleProduct.title}
            />
          </div>
        </div>
        <div>
          <Title text={singleProduct.title} />
          <Title text={singleProduct.subtitle} />
          <div className="flex justify-between">
            <p className="font-montserrat text-base font-medium ">
              {singleProduct.volume}
            </p>
            <span className="text-gray_dark font-montserrat text-base font-medium ">
              Артикул: {singleProduct.article}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {singleProduct.descriptions.map((desc, i) => (
            <p
              className="text-gray_dark text-base font-montserrat font-medium"
              key={i}
            >
              {desc}
            </p>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-[100%] h-20 bg-white py-[6px] px-[10px] ">
        <div className=" flex gap-[10px] justify-between items-center w-[100%]">
          <Button
            type={quantity}
            handleIncrement={handleIncrement}
            count={count}
            className={"px-[5px] py-3 w-[145px] h-[38px]"}
          />
          <Button
            onClick={addItem}
            text={"В корзину"}
            type="normal"
            className={
              "bg-secondary  w-[145px] h-[38px] flex justify-center items-center "
            }
          />
        </div>
      </div>
    </div>
  );
}
