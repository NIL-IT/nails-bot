import React, { useEffect } from "react";
import { Button, Title } from "../ui";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../utils/data";
import { Sidebar } from "../shared";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../features/slice/userSlice";
import { minus, quantity } from "../../utils/constants";
import { NotificationPopup } from "../shared/NotificationPopup";

export default function SingleProduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product } = useSelector(({ user }) => user);
  const singleProduct = PRODUCTS.filter((item) => item.id === parseInt(id))[0];
  const [count, setCount] = React.useState(1);
  const handleIncrement = (variant) => {
    if (variant === minus) {
      setCount(count > 1 ? count - 1 : count);
    } else setCount(count + 1);
  };
  const addItem = () => {
    dispatch(addItemToCart({ ...singleProduct, quantity: count }));
    handleCartPopupClose(false);
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
              src={product?.detail_picture ? product.detail_picture : ""}
              alt={product.name}
            />
          </div>
        </div>
        <div>
          <Title text={product.name} />
          <Title text={product.name} />
          <div className="flex justify-between">
            {/* <p className="font-montserrat text-base font-medium ">
              {singleProduct.volume}
            </p> */}
            <span className="text-gray_dark font-montserrat text-base font-medium ">
              Артикул: {product.id_product}
            </span>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: product.detailtext }}
          className="flex flex-col gap-4"
        />
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
