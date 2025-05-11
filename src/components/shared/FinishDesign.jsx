import React, { useState } from "react";
import { Button, Title } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import { minus, normal, quantity } from "../../utils/constants";
import Cookies from "js-cookie";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../features/slice/userSlice";

import { Link } from "react-router-dom";

import { API, baseURL } from "../../api";
import { NotificationPopup } from "./NotificationPopup";
const paymentData = [
  {
    id: 24,
    name: "Картой / СБП онлайн прямо сейчас",
  },
  {
    id: 10,
    name: "При получении (Карта / СБП / Наличные)",
  },
];
export default function FinishDsesign({
  formData,
  selectedStore,
  priceDelivery,
  handlePrevStep,
  user,
  deliveryOption,
}) {
  const [showNotification, setShowNotification] = useState(false);
  const [massage, setMassage] = useState("")
  const [isError, setIsError] = useState(false)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [activePayment, setActivePayment] = useState(paymentData[0].id);
  const { cart } = useSelector(({ user }) => user);
  const sum = cart.reduce((acc, item) => {
    let price =
      item?.base_price && item?.base_price !== "0.00"
        ? item.base_price
        : item?.purchasingprice
        ? item.purchasingprice
        : item?.opt_price
        ? item.opt_price
        : 0;
    if (item.quantity) {
      return acc + price * item.quantity;
    } else {
      return acc + price * 1;
    }
  }, 0);
  const handleIncrement = (variant, id) => {
    let currentItem = cart.find((item) => item.id === id);
    if (variant === minus) {
      dispatch(
        currentItem.quantity > 1
          ? addItemToCart({
              ...currentItem,
              quantity: currentItem.quantity - 1,
            })
          : addItemToCart({ ...currentItem, quantity: currentItem.quantity })
      );
    } else
      dispatch(
        addItemToCart({
          ...currentItem,
          quantity: currentItem.quantity + 1,
        })
      );
  };
  const removeItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleSubmit = async () => {
    if(!user?.id_tg) {
      setMassage("Не удалось распознать пользователя")
      setIsError(true)
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setMassage("")
        setIsError(false)
      }, 2000);
    }
    setIsLoading(true);
    const productsData = cart.map((product) => ({
      productId: product.id_product,
      quantity: product.quantity,
      name: product.name,
      price: product.base_price,
    }));
    const productsObject = productsData.reduce((acc, product, index) => {
      acc[index] = product;
      return acc;
    }, {});
    const sumPrice = sum + deliveryOption?.price;
    const bodyOption =
      deliveryOption.id === "selfPickup"
        ? JSON.stringify({
            type: "new_order",
            price: sumPrice,
            userId: user?.id_tg,
            products: productsObject,
            paySystemId: 24,
            deliveryId: selectedStore.deliveryId,
            fio: `${formData.lastName} ${formData.firstName} ${formData?.middleName}`,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            id_tg_user: user?.id_tg,
          })
        : JSON.stringify({
            type: "new_order",
            price: sumPrice,
            userId: user?.id_tg,
            products: productsObject,
            paySystemId: activePayment,
            deliveryId: deliveryOption.deliveryId,
            fio: `${formData.lastName} ${formData.firstName} ${formData?.middleName}`,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            id_tg_user: user?.id_tg,
            location: formData.region,
            index: formData.index,
            street: formData.street,
            home: formData.house,
            flat: formData.apartment,
          });
    try {
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyOption,
      };

      const resp = await fetch(`${baseURL}order.php`, option);
      const { data } = await API.parseResponseTwo(resp);
      console.log(sumPrice);
      const fetchPayment = await fetch(`${baseURL}payment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "init_payment",
          amount: sumPrice * 100,
          id_tg_user: user?.id_tg || 792820756,
          order_id: data.order_id,
        }),
      });
      const dataFetchPayment = await fetchPayment.json();
      const paymentId = dataFetchPayment.payment_id;


      console.log("dataFetchPayments", dataFetchPayment)

      console.log("dataFetchPayments", dataFetchPayment)
      console.log("dataFetchPayments", dataFetchPayment)
      console.log("dataFetchPayments", dataFetchPayment)
      console.log("dataFetchPayments", dataFetchPayment)
      console.log("dataFetchPayments", dataFetchPayment)
      Cookies.set("payment_id", paymentId);
      localStorage.setItem("payment_id", paymentId);
      sessionStorage.setItem("payment_id", paymentId);
      if(!dataFetchPayment) window.location.href = '/'
      if (activePayment === 24) {
        window.location.href = dataFetchPayment.payment_url;
      } else {
        setMassage("Заказ успешно создан")
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          setMassage("")
        }, 2000);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  console.log("formData", formData);
  console.log("selectedStore", selectedStore);
  return (
    <div>
      <NotificationPopup
        isVisible={showNotification}
        message={massage}
        isError={isError}
      />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/20 z-40">
          <div className="fixed top-0 left-0  w-full h-full z-50 flex items-center flex-col justify-center">
            <div className="loader"></div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6 mb-2">
        <div className="flex items-center ">
          <div className="min-w-8 min-h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            1
          </div>

          <span className="ml-3 font-medium">
            Получатель:
            <p>
              {formData.firstName} {formData.lastName} {formData.phone}
            </p>
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-2">
        <div className="flex items-center ">
          <div className="min-w-8 min-h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            2
          </div>
          <span className="ml-3 font-medium">
            {selectedStore
              ? selectedStore?.title || "Самовывоз из ПВЗ Boxberry"
              : `${formData.street} дом ${formData.house} квартира ${formData.apartment} `}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-2">
        <div className="flex items-center ">
          <div className="min-w-8 min-h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            3
          </div>
          <span className="ml-3 font-medium">Выбор способа оплаты</span>
        </div>
        <div className="mt-7 space-y-4 pl-1">
          {paymentData.map((el) => (
            <button
              onClick={() => setActivePayment(el.id)}
              key={el.id}
              className="flex items-center  gap-3"
            >
              <div className="min-h-[18px] min-w-[18px] rounded-full border border-primary flex items-center flex-col justify-center">
                <span
                  className={`h-[10px] w-[10px] rounded-full bg-primary ${
                    el.id === activePayment ? "block" : "hidden"
                  }`}
                ></span>
              </div>
              <p className="text-start">{el.name}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 ">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            4
          </div>
          <span className="ml-3 font-medium">Завершение оформления</span>
        </div>
        <div className="flex flex-col gap-[15px]  overflow-y-scroll">
          {cart.map((item) => {
            let price =
              item?.base_price && item?.base_price !== "0.00"
                ? item.base_price
                : item?.purchasingprice
                ? item.purchasingprice
                : item?.opt_price
                ? item.opt_price
                : 0;

            return (
              <div
                key={item.id}
                className="bg-gray rounded-[10px]  p-[6px] flex gap-[10px] items-center"
              >
                <div className="w-[38%] ">
                  <img
                    src={
                      item?.preview_picture
                        ? `https://shtuchki.pro${item.preview_picture}`
                        : `/img/no_photo.webp`
                    }
                    alt={item.name}
                  />
                </div>
                <div className="w-[62%]">
                  <div className="mb-1">
                    <div className="relative flex justify-between items-center w-full">
                      <div className="pr-5">
                        <Title text={item.name} size={"2xl"} />
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 ml-1 absolute top-0 right-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    </div>
                    <Title text={item.subtitle} size={"2xl"} />
                  </div>
                  <p className="text-base font-montserrat text-gray_dark mb-2">
                    Артикул:&nbsp;{item.articul}
                  </p>
                  <div className="flex justify-between items-center gap-2">
                    <Button
                      id={item.id}
                      type={quantity}
                      handleIncrement={handleIncrement}
                      count={item.quantity ? item.quantity : 1}
                      className={
                        " py-[5px] rounded-[6.5px] h-[24.6px] w-[77px]"
                      }
                      classNameIcons={"min-w-[30%]"}
                    />
                    {item.quantity ? (
                      <span className="font-3xl font-manrope font-semibold">
                        {price * item.quantity} ₽
                      </span>
                    ) : (
                      <span className="font-3xl font-manrope font-semibold">
                        {price} ₽
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mt-2 mb-[160px]">
        <div className=" mt-4  flex justify-between">
          <div className="flex flex-col  gap-2">
            <span className=" text-[16px]">Cумма</span>
            <span className="text-[20px]">{sum} ₽</span>
          </div>
          <div className="flex flex-col  gap-2">
            <span className=" text-[16px]">Доставка</span>
            <span className="text-[20px]">{deliveryOption.price || 0} ₽</span>
          </div>
          <div className="flex flex-col  gap-2 text-primary">
            <span className="text-[16px] ">Итого</span>
            <span className="text-[20px]">{sum + deliveryOption?.price} ₽</span>
          </div>
        </div>
      </div>
      <div className="fixed left-0 bottom-0 w-[100vw] h-[163px] p-[10px] bg-white">
        <div className="flex justify-between items-center mb-[15px]">
          <p className="text-base font-montserrat text-black ]">
            Общая стоимость заказа
          </p>
          <span
            className="font-semibold 
            font-manrope text-3xl"
          >
            {sum + deliveryOption?.price} ₽
          </span>
        </div>
        <div className="space-y-2">
          <Link
            onClick={() => handleSubmit()}
            className="text-white block text-center 
          text-2xl font-manrope font-semibold rounded-[10px]
           bg-secondary  py-[9px] w-full"
          >
            Оформить
          </Link>
          <button
            type="button"
            onClick={() => handlePrevStep(2)}
            className="flex
             items-center justify-center py-[9px] rounded-[10px]
               hover:text-primary w-full bg-gray_dark/20"
          >
            <span>Вернуться назад</span>
          </button>
        </div>
      </div>
    </div>
  );
}
