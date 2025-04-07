"use client";

import { useEffect, useState, useCallback } from "react";
import SearchInput from "../shared/SearchInput";
import { Product } from "../shared";
import { Link } from "react-router-dom";
import { API } from "../../api";
import SkeletonLoader from "../ui/SkeletonLoader";

// Skeleton loader component for multiple items

export default function SearchItems() {
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pendingProducts, setPendingProducts] = useState([]);

  const handleSearch = ({ target: { value } }) => {
    setValue(value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
  };

  // Function to add products to the list in batches
  const addProductsToList = useCallback((products) => {
    setList((prevList) => {
      // Take first 50 items (or all if less than 50)
      const newBatch = products.slice(0, 50);

      // Store remaining items for later
      const remaining = products.slice(50);
      if (remaining.length > 0) {
        setPendingProducts(remaining);
        // Set a timeout to load the rest after a short delay
        setTimeout(() => {
          setList((currentList) => [...currentList, ...remaining]);
          setPendingProducts([]);
        }, 300);
      }

      return [...prevList, ...newBatch];
    });
  }, []);

  useEffect(() => {
    let abortController = new AbortController();
    let timeoutId;

    const fetchData = async () => {
      if (!value.trim()) {
        setList([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Получаем секции с проверкой ответа
        const sectionsResponse = await API.fetchSearch(value.toLowerCase(), {
          signal: abortController.signal,
        });
        console.log("sectionsResponse", sectionsResponse);
        // 2. Проверка структуры ответа
        if (!sectionsResponse?.data?.data) {
          throw new Error("Invalid sections response structure");
        }
        const limitedSections = sectionsResponse.data.data.slice(0, 5); // Первые 5 секций
        console.log(limitedSections);
        // 3. Создаем безопасные промисы
        const productPromises = limitedSections.map(({ id_section }) => {
          if (!id_section) return Promise.resolve([]); // Защита от невалидных секций
          return API.getProducts(id_section, {
            signal: abortController.signal,
          })
            .then((response) => {
              // 4. Проверка структуры продуктов

              if (!response?.data) return [];
              return response.data;
            })
            .catch(() => []);
        });

        // 5. Ожидаем выполнения всех запросов
        const productsResults = await Promise.all(productPromises);
        console.log("productsResults", productsResults);
        // 6. Объединяем и проверяем данные
        const combinedProducts = productsResults.flat().slice(0, 50); // Максимум 50 товаров
        console.log("combinedProducts", combinedProducts);
        setList(combinedProducts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Ошибка при загрузке данных");
          console.error("Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    timeoutId = setTimeout(fetchData, 300);

    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [value]);

  return (
    <div>
      <SearchInput
        handleSubmit={handleSubmit}
        value={value}
        handleSearch={handleSearch}
      />

      <div className="mt-[100px]">
        {loading ? (
          <div className="flex flex-wrap justify-center gap-[10px] mb-[30px]">
            <SkeletonLoader count={10} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : list.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-[10px] mb-[30px]">
            {list.map((item, i) => {
              // Check before rendering
              if (!item?.id) return null;
              return (
                <div key={i}>
                  <Product search={true} idItem={item.id} />
                </div>
              );
            })}

            {pendingProducts.length > 0 && (
              <div className="w-full text-center py-2">
                <p className="text-sm text-gray-500">Загружаем еще товары...</p>
              </div>
            )}
          </div>
        ) : value ? (
          <div className="h-[70vh] flex flex-col justify-center items-center">
            <p className="font-montserrat">
              По вашему запросу ничего не найдено
            </p>
            <div className="h-[200px] w-[200px]">
              <img src="/img/nofaund.png" alt="Not found" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
