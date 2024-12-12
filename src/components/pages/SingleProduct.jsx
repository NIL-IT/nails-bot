import React from "react";
import { Button, Title } from "../ui";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../utils/data";
const minus = "minus";
const plus = "plus";
export default function SingleProduct() {
  const { id } = useParams();
  const product = PRODUCTS.filter((item) => item.id === parseInt(id));
  const singleProduct = product[0];
  const [count, setCount] = React.useState(1);
  const handleIncrement = (variant) => {
    if (variant === minus) {
      setCount(count > 1 ? count - 1 : count);
    } else setCount(count + 1);
  };
  return (
    <div className="mb-9 mt-[30px]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-center">
          <img
            className="h-[171px] w-[300px] "
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
      <div className="mt-[77px] flex gap-[10px] justify-between items-center">
        <div className="flex items-center justify-between border border-primary px-[39px] py-3 rounded-[10px] w-[145px] h-[38px]">
          <button onClick={() => handleIncrement(minus)}>
            <img src="../../../public/img/-.svg" alt="минус" />
          </button>

          <span className="text-primary text-xl font-montserrat font-medium">
            {count}
          </span>
          <button onClick={() => handleIncrement(plus)}>
            <img src="../../../public/img/+.svg" alt="плюс" />
          </button>
        </div>
        <Button
          text={"В корзину"}
          type="normal"
          className={
            "bg-secondary  w-[145px] h-[38px] flex justify-center items-center"
          }
        />
      </div>
    </div>
  );
}
