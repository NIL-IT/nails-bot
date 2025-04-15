import React, { useEffect, useState } from "react";
import { Title } from "../ui";
import { API } from "../../api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeCurrentProduct } from "../../features/slice/userSlice";

export function Product({ idItem, search, className }) {
  const dispatch = useDispatch();

  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const fetchAllData = async () => {
      try {
        const fetchProduct = await API.getProduct(idItem);
        setItemData(fetchProduct.data[0]);
      } catch (error) {
        console.error("Global fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);
  return loading ? (
    <div className="w-[145px] h-[225px]"></div>
  ) : (
    <Link
      key={itemData.id}
      to={`/product/${itemData.id}`}
      onClick={() => dispatch(changeCurrentProduct(itemData))}
      className={` 
       flex flex-col gap-[10px]  rounded-[10px]
     w-[145px] h-full min-h-[189px] ${
       search ? "bg-gray_dark/10 p-2" : "bg-gray p-[6px]"
     } ${className ? className : "max-w-[145px]"}`}
    >
      <img
        className="rounded-[10px] w-full h-[89px] object-cover object-center"
        src={
          itemData?.preview_picture
            ? `https://shtuchki.pro${itemData.preview_picture}`
            : "/img/no_photo.webp"
        }
        alt={itemData.name}
      />
      <div className="flex flex-col justify-between h-full">
        <div>
          <Title text={itemData.name} size={"text-2xl"} />
          {/* <div className="text-base font-medium">
            <p>{itemData.desc}</p>
            <p>{itemData.volume}</p>
          </div> */}
        </div>

        <div
          className={`text-2xl font-semibold mb-1 ${search ? "pt-5" : "pt-2"}`}
        >
          {itemData.base_price} ₽
        </div>
      </div>
    </Link>
  );
}
