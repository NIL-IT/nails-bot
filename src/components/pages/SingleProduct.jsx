import React, { useEffect, useState } from "react";
import { Button, Title } from "../ui";
import { useParams } from "react-router-dom";
import { Sidebar } from "../shared";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../features/slice/userSlice";
import { minus, quantity } from "../../utils/constants";
import { NotificationPopup } from "../shared/NotificationPopup";
import { API } from "../../api";

// Import or define SkeletonLoader component
function SkeletonLoader() {
  return (
    <div>
      <div className="flex flex-col gap-5 overflow-scroll mb-[90px]">
        {/* Image skeleton */}
        <div className="flex justify-center">
          <div className="w-[171px] h-[171px] bg-gray_dark animate-pulse rounded-md"></div>
        </div>

        {/* Title and details skeleton */}
        <div>
          <div className="h-6 bg-gray_dark animate-pulse rounded-md w-3/4 mb-2"></div>
          <div className="flex justify-between">
            <span className="h-4 bg-gray_dark animate-pulse rounded-md w-1/3"></span>
          </div>
        </div>

        {/* Content skeleton - multiple lines */}
        <div className="space-y-1 mb-5">
          <div className="h-4 bg-gray_dark animate-pulse rounded-md w-full"></div>
          <div className="h-4 bg-gray_dark animate-pulse rounded-md w-full"></div>
          <div className="h-4 bg-gray_dark animate-pulse rounded-md w-3/4"></div>
          <div className="h-4 bg-gray_dark animate-pulse rounded-md w-5/6"></div>
          <div className="h-4 bg-gray_dark animate-pulse rounded-md w-full"></div>
        </div>
      </div>

      {/* Bottom fixed buttons skeleton */}
      <div className="fixed bottom-0 left-0 w-full h-20 bg-white py-[6px] px-[10px]">
        <div className="flex gap-[10px] justify-between items-center w-full">
          <div className="bg-gray_dark animate-pulse rounded-md w-[145px] h-[38px]"></div>
          <div className="bg-gray_dark animate-pulse rounded-md w-[145px] h-[38px]"></div>
        </div>
      </div>
    </div>
  );
}

export default function SingleProduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [count, setCount] = React.useState(1);
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const fetchAllData = async () => {
      try {
        const fetchProduct = await API.getProduct(id);
        setItemData(fetchProduct.data[0]);
      } catch (error) {
        console.error("Global fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleIncrement = (variant) => {
    if (variant === minus) {
      setCount(count > 1 ? count - 1 : count);
    } else setCount(count + 1);
  };

  const addItem = () => {
    dispatch(addItemToCart({ ...itemData, quantity: count }));
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

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      <NotificationPopup
        isVisible={showNotification}
        message={"Товар добавлен в корзину"}
      />
      <div className="flex flex-col gap-5 overflow-scroll mb-[90px]">
        <div className="flex justify-center ">
          <div className="w-[171px] h-[171px] ">
            <img
              className="h-[171px] w-[171px] "
              src={
                itemData?.detail_picture
                  ? `https://shtuchki.pro${itemData.detail_picture}`
                  : "/img/no_photo.webp"
              }
              alt={itemData.name}
            />
          </div>
        </div>
        <div>
          <Title text={itemData.name} />

          <div className="flex justify-between">
            <span className="text-gray_dark font-montserrat text-[12px] font-medium">
              Артикул: {itemData.articul}
            </span>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: itemData.detailtext }}
          className="space-y-1 mb-5"
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
              "bg-secondary w-[145px] h-[38px] flex justify-center items-center"
            }
          />
        </div>
      </div>
    </div>
  );
}
