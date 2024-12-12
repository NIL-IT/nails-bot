import React, { useEffect } from "react";
import { PRODUCTS } from "../../utils/data";
import { Button, Title } from "../ui";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Product } from "../shared";
import { basket } from "../../utils/constants";
import { ROUTES } from "../routes/routes";
export default function SingleCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  let products = PRODUCTS.filter(
    ({ category }) => category.id === parseInt(id)
  );
  const [list, setList] = React.useState(products);
  useEffect(() => {
    if (!products.length > 0 && !id) navigate(ROUTES.HOME);
    products = PRODUCTS.filter(({ category }) => category.id === parseInt(id));
    setList(products);
  }, [id]);

  const handleClick = (title) => {
    setList(
      products.filter((item) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      )
    );
  };

  return list.length > 0 ? (
    <div className="mt-[30px]">
      <Title text={list[0].category.name} className={"mb-5"} />
      <div className="flex gap-[10px] flex-wrap mb-[30px]">
        {products.map(({ title }, i) => (
          <a onClick={() => handleClick(title)} key={i}>
            <p className="underline decoration-1 text-xl text-primary font-montserrat">
              {title.split(" ").slice(1, 3).join(" ")}
            </p>
          </a>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-[10px]">
        {list.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Product item={product} />
          </Link>
        ))}
      </div>
      <Button
        className={"fixed bottom-40 right-[10px]"}
        type={basket}
        text="Корзина"
      />
    </div>
  ) : (
    <>
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-xl text-primary font-montserrat">
          Товары по этой категории не найдены
        </p>
      </div>
    </>
  );
}
