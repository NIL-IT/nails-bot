import React, { useEffect, useState } from "react";
import { Title } from "../ui";
import { API } from "../../api";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeCurrentProduct } from "../../features/slice/userSlice";

export function Product({ idItem }) {
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
    <div>Загрузка</div>
  ) : (
    <Link
      key={itemData.id}
      to={`/product/${itemData.id}`}
      onClick={() => dispatch(changeCurrentProduct(itemData))}
      className="p-[6px] max-w-[145px] flex flex-col gap-[10px] bg-gray rounded-[10px]
     w-[145px] h-full min-h-[189px]"
    >
      <img
        className="rounded-[10px] w-full h-[89px] object-cover object-center"
        src={`https://shtuchki.pro${itemData.preview_picture}`}
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
        {itemData.base_price && (
          <div className="text-2xl font-semibold mb-1">
            {itemData.base_price} ₽
          </div>
        )}
      </div>
    </Link>
  );
}
