import React, { useEffect, useState } from "react";
import { Button, Title } from "../ui";
import { useSearchParams } from "react-router-dom";
import { Product, Sidebar } from "../shared";
import { basket } from "../../utils/constants";
import { API } from "../../api";
import { CategoryItem } from "../shared/CategoryItem";
export default function SingleCategory({ categories }) {
  const [searchParams] = useSearchParams(); // Добавлено: получение query-параметров
  const id = searchParams.get("id"); // Извлечение id
  const nameParam = searchParams.get("name"); // Извлечение name
  const decodedName = nameParam ? decodeURIComponent(nameParam) : "";
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategory, setIsCategory] = useState(null);

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
  return (
    <div>
      {categories.length > 0 && <Sidebar categories={categories} />}
      {itemsData.length > 0 ? (
        <div className="my-[30px] ">
          <Title text={decodedName} className={"mb-5"} />
          <div className="flex gap-[10px] flex-wrap mb-[30px]">
            {/* {products.map(({ title }, i) => (
              <a onClick={() => handleClick(title, i)} key={i}>
                <p
                  className={`${
                    indexItem === i
                      ? "text-secondary font-semibold underline underline-offset-4"
                      : ""
                  } underline decoration-1 text-xl cursor-pointer text-primary font-montserrat`}
                >
                  {title.split(" ").slice(1, 3).join(" ")}
                </p>
              </a>
            ))} */}
          </div>
          <div className="w-full flex justify-center">
            {!isCategory ? (
              <div className="justify-self-center grid grid-cols-2 gap-[20px]">
                {itemsData.map((product, index) => {
                  return (
                    <div key={index}>
                      <Product idItem={product.id} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="justify-self-center grid grid-cols-2 gap-[20px]">
                {itemsData.map((product, index) => (
                  <div key={index}>
                    <CategoryItem category={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Загрузка</div>
      )}

      <Button
        className={"fixed bottom-[50px] right-[10px]"}
        type={basket}
        text="Корзина"
      />
    </div>
  );
}
