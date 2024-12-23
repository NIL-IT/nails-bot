import React from "react";
import { Button, Title } from "../ui";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../utils/data";
import { Sidebar } from "../shared";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../features/slice/userSlice";
import { minus, quantity } from "../../utils/constants";

export default function SingleProduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const product = PRODUCTS.filter((item) => item.id === parseInt(id));
  const singleProduct = product[0];
  const [count, setCount] = React.useState(1);
  const handleIncrement = (variant) => {
    if (variant === minus) {
      setCount(count > 1 ? count - 1 : count);
    } else setCount(count + 1);
  };
  const addItem = () => {
    console.log(singleProduct);
    dispatch(addItemToCart({ ...singleProduct, quantity: count }));
  };

  return (
    <div>
      <Sidebar />
      <div className="flex flex-col gap-5 overflow-scroll mb-[90px]">
        <div className="flex justify-center">
          <img
            className="h-[174px] w-[174px] "
            src={singleProduct.img}
            alt={singleProduct.title}
          />
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
            className={"px-[29px] py-3 w-[145px] h-[38px]"}
          />
          <Button
            onClick={addItem()}
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
