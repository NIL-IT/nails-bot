import React, { useEffect } from "react";
import { PRODUCTS } from "../../utils/data";
import { Button, Title } from "../ui";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Product, Sidebar } from "../shared";
import { basket } from "../../utils/constants";
import { ROUTES } from "../routes/routes";
export default function SingleCategory({ categories }) {
  const { id } = useParams();
  const navigate = useNavigate();
  let products = PRODUCTS.filter(
    ({ category }) => category.id === parseInt(id)
  );
  const [list, setList] = React.useState(products);
  const [indexItem, setIndex] = React.useState(null);
  useEffect(() => {
    if (!products.length > 0 || !id) navigate(ROUTES.HOME);
    products = PRODUCTS.filter(({ category }) => category.id === parseInt(id));
    setList(products);
    let find = PRODUCTS.find(({ category }) => category.id == id);
    if (!find) navigate(ROUTES.HOME);
    setIndex(null);
  }, [id]);

  const handleClick = (title, index) => {
    setList(
      products.filter((item) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      )
    );
    setIndex(index);
  };

  return list.length > 0 ? (
    <div>
      <Sidebar categories={categories} />
      <div className="my-[30px] ">
        <Title text={list[0].category.name} className={"mb-5"} />
        <div className="flex gap-[10px] flex-wrap mb-[30px]">
          {products.map(({ title }, i) => (
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
          ))}
        </div>
        <div className="flex justify-center gap-[10px]">
          {list.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Product item={product} />
            </Link>
          ))}
        </div>
        <Button
          className={"fixed bottom-[50px] right-[10px]"}
          type={basket}
          text="Корзина"
        />
      </div>
    </div>
  ) : (
    <></>
  );
}
