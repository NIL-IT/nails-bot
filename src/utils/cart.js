import { PRODUCTS } from "./data";

const getCookie = (name) => {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([$?*|{}()[\\]\\+^])/g, "\\$1")}=([^;]*)`
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};
export function getAllCart() {
  let list = [];
  for (let { id } of PRODUCTS) {
    const cartFromCookie = getCookie(`cart_${id}`);
    if (cartFromCookie && typeof cartFromCookie === "object") {
      list.push(JSON.parse(cartFromCookie));
    } else {
      const cartFromLocalStorage = localStorage.getItem(`cart_${id}`);
      if (cartFromLocalStorage) {
        list.push(JSON.parse(cartFromLocalStorage));
      } else {
        const cartFromSessionStorage = sessionStorage.getItem(`cart_${id}`);
        if (cartFromSessionStorage) {
          list.push(JSON.parse(cartFromSessionStorage));
        }
      }
    }
  }

  return list;
}
