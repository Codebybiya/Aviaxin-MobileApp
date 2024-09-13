import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context for the cart
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const existingCart = await AsyncStorage.getItem("cartItems");
        const parsedCartItems = existingCart ? JSON.parse(existingCart) : [];
        setCartItems(parsedCartItems);
      } catch (error) {
        console.error("Failed to load cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  const saveCartItems = async (items) => {
    try {
      await AsyncStorage.setItem("cartItems", JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error("Failed to save cart items:", error);
    }
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    saveCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      saveCartItems(updatedCart);
    } else {
      removeItem(index);
    }
  };

  const removeItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    saveCartItems(updatedCart);
  };

  const clearCart = () => {
    saveCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
