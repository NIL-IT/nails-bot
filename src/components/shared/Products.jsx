import React from "react";
import { Product } from "./index";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../utils/data";
import { outline } from "../../utils/constants";
import { Button, Title } from "../ui";

export function Products({ categoryId, name }) {
  let filtered = PRODUCTS.filter(
    ({ category: { id } }) => id === categoryId
  ).slice(0, 2);
  return (
    filtered.length > 0 && (
      <div>
        <div
          to={`/categories/${categoryId}`}
          className="flex items-center justify-between mb-5"
        >
          <Title size={"text-3xl"} text={name} />

          <Button text="Все" type={outline} id={categoryId} />
        </div>
        <div className="flex justify-between">
          {filtered.map((product, i) => (
            <Link key={i} to={`/products/${product.id}`}>
              <Product item={product} />
            </Link>
          ))}
        </div>
      </div>
    )
  );
}
