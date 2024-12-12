import React from "react";
import { Products } from "../shared";
import { Button, Title } from "../ui";
import { CATEGORIES } from "../../utils/data";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

const Home = () => {
  return (
    <main className="my-[30px]">
      <div className="flex flex-col gap-[30px]">
        {CATEGORIES.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between mb-5">
              <Title size={"text-3xl"} text={category.name} />
              <Link to={`/categories/${category.id}`}>
                <Button text="Все" type="outline" />
              </Link>
            </div>

            <Products categoryId={category.id} />
          </div>
        ))}
      </div>
      <Button
        className={"fixed bottom-44 right-[10px]"}
        type="basket"
        text="Корзина"
      />
    </main>
  );
};

export default Home;
