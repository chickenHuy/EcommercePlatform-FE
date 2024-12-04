import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import componentSlice from "./features/componentSlice";
import brandSlice from "./features/brandSlice";
import searchSlice from "./features/searchSlice";
import orderFilter from "./features/orderFilterSlice";
import userSearchSlice from "./features/userSearchSlice";
import userSlice from "./features/userSlice";
import cartSlice from "./features/cartSlice";
import checkoutSlice from "./features/checkoutSlice";
import wishListSlice from "./features/wishListSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      loginReducer: loginSlice,
      componentReducer: componentSlice,
      brandReducer: brandSlice,
      searchReducer: searchSlice,
      orderFilterReducer: orderFilter,
      searchFilter: userSearchSlice,
      userReducer: userSlice,
      cartReducer: cartSlice,
      checkoutReducer: checkoutSlice,
      wishListReducer: wishListSlice,
    },
  });
};
