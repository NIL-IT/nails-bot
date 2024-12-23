import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    cart: [],
  },
  reducers: {
    addItemToCart: (state, { payload }) => {
      let newCart = [...state.cart];
      const found = state.cart.find(({ id }) => id === payload.id);
      if (found) {
        newCart = newCart.map((item) => {
          return item.id === payload.id
            ? { ...item, quantity: payload.quantity || item.quantity + 1 }
            : item;
        });
      } else newCart.push({ ...payload, quantity: payload.quantity || 1 });
      state.cart = newCart;
    },
    removeItemFromCart: (state, { payload }) => {
      state.cart = state.cart.filter(({ id }) => id !== payload);
    },
  },
  extraReducers: (builder) => {},
});
export const { addItemToCart, removeItemFromCart } = userSlice.actions;
export default userSlice.reducer;
