import React, { useEffect } from "react";
import { Button, Title } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import { minus, normal, quantity } from "../../utils/constants";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../features/slice/userSlice";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export default function Card() {
  const dispatch = useDispatch();

  const { cart } = useSelector(({ user }) => user);
  const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
  return cart.length ? (
    <div>
      <Title text={"Корзина товаров"} className={"mb-[30px]"} />
      <div className="flex flex-col gap-[15px] mb-[130px] overflow-y-scroll">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-gray rounded-[10px]  p-[6px] flex gap-[10px] items-center"
          >
            <div className="w-[38%] ">
              <img src={item.img} alt={item.title} />
            </div>
            <div className="w-[62%]">
              <div className="mb-1">
                <div className="flex justify-between items-center w-full">
                  <Title text={item.title} size={"2xl"} />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 ml-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-trash-2"
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
                {item.desc}
                <br />
                {item.volume}
              </p>
              <p className="text-base font-montserrat text-gray_dark mb-2">
                Артикул:&nbsp;{item.article}
              </p>
              <div className="flex justify-between items-center gap-2">
                <Button
                  id={item.id}
                  type={quantity}
                  handleIncrement={handleIncrement}
                  count={item.quantity}
                  className={" py-[5px] rounded-[6.5px] h-[24.6px] w-[77px]"}
                  classNameIcons={"min-w-[30%]"}
                />
                <span className="font-3xl font-manrope font-semibold">
                  {item.price * item.quantity}₽
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed left-0 bottom-0 w-[100vw] h-[123px] p-[10px] bg-white">
        <div className="flex justify-between items-center mb-[15px]">
          <p className="text-base font-montserrat text-black ]">
            Общая стоимость заказа
          </p>
          <span className="font-semibold font-manrope text-3xl">{sum}₽</span>
        </div>
        <Button
          text={"Оформить"}
          type={normal}
          className={"w-[100%] bg-secondary"}
        />
      </div>
    </div>
  ) : (
    <div className="h-[70vh] flex flex-col justify-center items-center   text-center">
      <div className="w-[100px] h-[100px]">
        <img width={100} src="/img/cart.png" alt="" />
      </div>
      <div className="font-montserrat text-center flex flex-col gap-0">
        <p>В корзине пока пусто</p>
        <span className="text-base text-gray_dark">
          Корзина ждёт что её наполнят!
        </span>
      </div>
      <Link className="w-[80%]">
        <Button
          text={"Перейти в каталог"}
          type={normal}
          to={ROUTES.HOME}
          className={"w-[80%] bg-secondary mt-[20px] mb-[30px]"}
        />
      </Link>
    </div>
  );
}
