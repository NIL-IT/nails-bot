import React, { useEffect, useState } from "react";
import SearchInput from "../shared/SearchInput";
import { PRODUCTS } from "../../utils/data";
import { Product } from "../shared";
import { Link } from "react-router-dom";

export default function SearchItems() {
  const [value, setValue] = useState("");
  const [list, setList] = useState(PRODUCTS.slice(0, 10));
  const handleSearch = ({ target: { value } }) => {
    setValue(value);
  };
  const handleSubmit = (e) => {
    e?.preventDefault();
  };

  useEffect(() => {
    setTimeout(() => {
      setList(
        PRODUCTS.filter((item) => {
          return item.title.toLowerCase().includes(value.toLowerCase());
        })
      );
    }, 300);
  }, [value]);

  return (
    <div>
      <SearchInput
        handleSubmit={handleSubmit}
        value={value}
        handleSearch={handleSearch}
      />
      <div className="mt-[100px]">
        {list.length ? (
          <div className="flex flex-wrap justify-center  gap-[10px] mb-[30px]  ">
            {list.map((item) => (
              <Link to={`/products/${item.id}`} key={item.id}>
                <Product item={item} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-[70vh] flex flex-col justify-center items-center">
            <p className="font-montserrat">
              По вашему запросу ничего не найдено
            </p>
            <div className="h-[200px] w-[200px]">
              <img src="/img/nofaund.png" alt="" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
