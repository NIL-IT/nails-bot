import React, { useState, useEffect } from "react";
import { Product } from "./index";
import { Link } from "react-router-dom";
import { outline } from "../../utils/constants";
import { Button, Title } from "../ui";
import { useDispatch } from "react-redux";
import {
  changeCategoryName,
  changeCurrentProduct,
} from "../../features/slice/userSlice";
import { API } from "../../api";
import { CategoryItem } from "./CategoryItem";
import SkeletonLoader from "../ui/SkeletonLoader";

export function CategoryList({ subCategory }) {
  const [itemsData, setItemsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const requests = subCategory.map(async (item) => {
          try {
            const res = await API.getProducts(item.id_section);
            return { type: "category", id: item.id, data: res.data };
          } catch (error) {
            console.error("Error fetching item:", error);
            return null;
          }
        });

        const responses = await Promise.all(requests);
        if (!isMounted) return;

        const normalizedData = responses.reduce((acc, response) => {
          if (response) {
            // Нормализация данных для продуктов
            acc[response.id] =
              response.type === "product" ? response.data : response.data;
          }
          return acc;
        }, {});

        setItemsData(normalizedData);
      } catch (error) {
        console.error("Global fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [subCategory]);
  return (
    <div className="space-y-[30px]">
      {subCategory.map((item, index) => {
        const itemData = itemsData[item.id];
        if (itemData) {
          if (itemData.length === 0) return;
          const isCategory = itemData[0].hasOwnProperty("id_section");
          return (
            <div key={item.id} className="">
              <div className="flex items-center justify-between mb-5">
                <Title size="text-3xl" text={item.name} />
                <Link
                  onClick={(e) => {
                    dispatch(changeCategoryName(item.name));
                  }}
                  to={`/categories?id=${item.id_section}&name=${item.name}`}
                >
                  <button
                    className=" rounded-[10px] border
                   border-primary px-[10px] py-[7px]"
                  >
                    <div className="flex items-center gap-[5px]">
                      <span
                        className="text-primary
                       text-base font-montserrat"
                      >
                        Все
                      </span>
                      <img
                        className={index == 0 ? "translate-y-[-1px]" : ""}
                        src="/img/arrow-right.svg"
                        alt="arrow-right"
                      />
                    </div>
                  </button>
                </Link>
              </div>

              {loading ? (
                <div>Загрузка...</div>
              ) : (
                <div
                  className="justify-self-center
                 grid grid-cols-2 gap-[20px] w-[310px] mx-auto"
                >
                  {isCategory ? (
                    <>
                      {itemData.map((product, index) => {
                        if (index >= 2) return;
                        return (
                          <div key={index}>
                            <CategoryItem category={product} />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {itemData.map(({ id }, index) => {
                        if (index >= 2) return;
                        return (
                          <div key={index}>
                            <Product idItem={id} />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div key={item.id}>
              <div
                className="flex items-center justify-between mb-5"
                key={item.id}
              >
                <Title size="text-3xl" text={item.name} />
                <Button text="Все" type={outline} id={item.id} />
              </div>
              <div className="justify-self-center grid grid-cols-2 gap-[20px]">
                <SkeletonLoader count={2} />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
