import React from "react";
import { Product } from "./index";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../utils/data";

export function Products({ categoryId }) {
  let filtered = PRODUCTS.filter(
    ({ category: { id } }) => id === categoryId
  ).slice(0, 2);

  return (
    <div className="flex justify-between">
      {filtered.map((product, i) => (
        <Link key={i} to={`/products/${product.id}`}>
          <Product key={i} item={product} />
        </Link>
      ))}
    </div>
  );
}
