import React, { useEffect, useState } from "react";
import { Products, Sidebar } from "../shared";
import { Button } from "../ui";
import { CATEGORIES } from "../../utils/data";
import { basket } from "../../utils/constants";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = ({ categories }) => {
  const { pathname } = useLocation();
  const [itemsList, setItemsList] = useState(null);
  const { currentCategory } = useSelector(({ user }) => user);
  useEffect(() => {
    if (!currentCategory) {
      console.log("No category");
      setItemsList(categories[0].children);
    } else {
      const list = categories.find(({ id }) => +id === +currentCategory);
      setItemsList(list?.children ? list.children : list);
    }
  }, [currentCategory]);
  return itemsList ? (
    <main className="mb-[30px]">
      <Sidebar categories={categories} />
      <div className="flex flex-col gap-[30px]">
        {itemsList.map(({ name, id, children }) => (
          <Products
            key={id}
            name={name}
            categoryId={id}
            products={children || null}
          />
        ))}
      </div>
      <Button
        className={"fixed bottom-[50px] right-[10px]"}
        type={basket}
        text="Корзина"
      />
    </main>
  ) : (
    <></>
  );
};

export default Home;
