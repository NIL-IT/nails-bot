import React, { useEffect } from "react";
import { Button, Title } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import { minus, normal, quantity } from "../../utils/constants";
import { addItemToCart } from "../../features/slice/userSlice";

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
  // useEffect(() => {
  //   sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  //   console.log(sum);
  // }, [cart]);
  return (
    <div>
      <Title text={"Корзина товаров"} className={"mb-[30px]"} />
      <div className="flex flex-col gap-[15px] mb-[130px] overflow-y-scroll">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-gray rounded-[10px]  p-[6px] flex gap-[10px] items-center"
          >
            <div className="w-[50%] ">
              <img src={item.img} alt={item.title} />
            </div>
            <div className="w-[50%]">
              <div className="mb-1">
                <Title text={item.title} size={"2xl"} />
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
                  className={
                    " py-[5px] px-[10px] rounded-[6.5px] gap-[15px] h-[24.6px] w-[77px]"
                  }
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
  );
}
