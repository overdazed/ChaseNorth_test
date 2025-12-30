// import configure store from redux
// this will help us to configure our store to manage the state in our app
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrdersReducer from "./slices/adminOrderSlice";
import wishlistReducer from "./slices/wishlistSlice";

// declare a store constant, that will use the configureStore function to create redux store
const store = configureStore({
    reducer: { // functionality like user reducer / cart reducer
        // add key auth
        auth: authReducer,
        // Open Register.jsx file > import { registerUser } from "../redux/slices/authSlice";
        // initialize dispatch variable

        products: productReducer,

        cart: cartReducer,
        // Create a new file under slices folder > checkoutSlice.js

        // add key checkout
        checkout: checkoutReducer,
        // create a new file under slices folder > orderSlice.js

        // add key order
        orders: orderReducer,
        // Create a new file under slices folder > adminSlice.js

        admin: adminReducer,
        // Create a new file under slices folder > adminProductSlice.js

        adminProducts: adminProductReducer,
        // Create a new file under slices folder > adminOrderSlice.js

        adminOrders: adminOrdersReducer,
        
        // Add wishlist reducer
        wishlist: wishlistReducer

        // REDUX IMPLEMENTED, integrate frontend with backend
    }

});

// export the store
export default store;

// create a slices folder
// this folder will contain different functionalities in separate files
// 1. authenticating the user
// 2. cart functionality


