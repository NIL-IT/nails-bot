import React from "react";
import { Products } from "../shared";
import { Button } from "../ui";
import { CATEGORIES } from "../../utils/data";
import { basket } from "../../utils/constants";

const Home = () => {
  return (
    <main className="my-[30px]">
      <div className="flex flex-col gap-[30px]">
        {CATEGORIES.map(({ name, id }) => (
          <Products key={id} name={name} categoryId={id} />
        ))}
      </div>
      <Button
        className={"fixed bottom-40 right-[10px]"}
        type={basket}
        text="Корзина"
      />
    </main>
  );
};

export default Home;
