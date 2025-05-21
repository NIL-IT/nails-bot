import React, { useEffect, useState } from "react";
import { Button, Title } from "../ui";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Product, Sidebar } from "../shared";
import { basket } from "../../utils/constants";
import { API } from "../../api";
import { CategoryItem } from "../shared/CategoryItem";
import { X } from "lucide-react";
import SkeletonLoader from "../ui/SkeletonLoader";
export default function SingleCategory() {
  console.log("SingleCategory");
  const [searchParams] = useSearchParams(); // Добавлено: получение query-параметров
  const id = searchParams.get("id"); // Извлечение id
  const nameParam = searchParams.get("name"); // Извлечение name
  const decodedName = nameParam ? decodeURIComponent(nameParam) : "";
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategory, setIsCategory] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }, [searchParams]);
  useEffect(() => {
    setLoading(true);
    const fetchAllData = async () => {
      try {
        const fetchProduct = await API.getProducts(id);

        setItemsData(fetchProduct.data);
        setIsCategory(fetchProduct.data[0].hasOwnProperty("id_section"));
      } catch (error) {
        console.error("Global fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, nameParam]);
  const handleClick = (title, index) => {
    // setList(
    //   products.filter((item) =>
    //     item.title.toLowerCase().includes(title.toLowerCase())
    //   )
    // );
    // setIndex(index);
  };
  console.log("itemsData", itemsData);
  return (
    <div>
      {itemsData.length > 0 ? (
        <div className="my-[30px] ">
          <Title text={decodedName} className={"mb-5"} />
          <div className="w-full flex justify-center h-full">
            {!isCategory ? (
              <div className="justify-self-center grid grid-cols-2 gap-[10px_20px]">
                {itemsData.map((product, index) => {
                  return (
                    <div key={index}>
                      <Product idItem={product.id} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="justify-self-center grid grid-cols-2 gap-[20px_10px]">
                {itemsData.map((product, index) => (
                  <div key={index}>
                    <CategoryItem category={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : !loading && itemsData.length <= 0 ? (
        <div className="flex items-center flex-col w-full justify-center absolute top-[50%] translate-y-[-50%]">
          <div className="flex items-center gap-4">
            <div className="h-[40px] w-[40px] rounded-full bg-primary relative">
              <X
                size={24}
                strokeWidth={3}
                stroke="#fff"
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              />
            </div>
            <div>
              <h4>К сожалению, раздел пуст</h4>
              <p className="text-[12px]">
                В данный момент нет активных товаров
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex
             items-center justify-center mt-10 py-[9px] rounded-[10px]
                w-[200px] bg-primary text-white"
          >
            <span>Вернуться назад</span>
          </button>
        </div>
      ) : (
        <div className="justify-self-center grid grid-cols-2 gap-[20px]">
          <SkeletonLoader />
        </div>
      )}

      <Button
        className={"fixed bottom-[50px] right-[10px]"}
        type={basket}
        text="Корзина"
      />
    </div>
  );
}
