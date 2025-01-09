import React from "react";
import { Products, Sidebar } from "../shared";
import { Button } from "../ui";
import { CATEGORIES } from "../../utils/data";
import { basket } from "../../utils/constants";

const Home = () => {
  return (
    <main className="mb-[30px]">
      <Sidebar />
      <div className="flex flex-col gap-[30px]">
        {CATEGORIES.map(({ name, id }) => (
          <Products key={id} name={name} categoryId={id} />
        ))}
      </div>
      <Button
        className={"fixed bottom-[50px] right-[10px]"}
        type={basket}
        text="Корзина"
      />
    </main>
  );
};

export default Home;
