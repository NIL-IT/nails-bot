import React from "react";
import { Title } from "../ui";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeCurrentProduct } from "../../features/slice/userSlice";

export function CategoryItem({ category }) {
  const dispatch = useDispatch();
  console.log("category", category);
  return (
    <Link
      to={`/categories?id=${category.id_section}&name=${category.name}`}
      onClick={() => {
        console.log("Category", category.id_section);
      }}
      className="p-[6px] max-w-[145px]  flex flex-col justify-between gap-[10px] bg-gray rounded-[10px]
     w-[145px] h-full min-h-[189px]"
    >
      <img
        className="rounded-[10px] w-full h-[120px] object-cover object-center"
        src={
          category?.picture
            ? `https://shtuchki.pro/${category.picture}`
            : `/img/no_photo.webp`
        }
        alt={category.name}
      />

      <Title text={category.name} size={"text-2xl"} />
    </Link>
  );
}
