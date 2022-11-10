import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { IProduct, ICartProduct } from "../types";

interface IStateContext {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: ICartProduct[];
  setCartItems: React.Dispatch<React.SetStateAction<ICartProduct[]>>;
  totalPrice?: number;
  totalQuantities?: number;
  onAdd: (product: IProduct, quantity: number) => void;
  onRemove: (product: IProduct, quantity: number) => void;
}

const Context = createContext<IStateContext | null>(null);

interface IStateContextProps {
  children?: React.ReactNode;
}

export const StateContext: React.FC<IStateContextProps> = (props) => {
  const { children } = props;

  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<ICartProduct[]>([]);
  const [totalPrice, totalQuantities] = cartItems.reduce(
    ([total, quantity], item) => [
      total + item.price * item.quantity,
      quantity + item.quantity,
    ],
    [0, 0]
  );

  const onAdd = (product: IProduct, quantity: number) => {
    setCartItems((prevCartItems) => {
      toast.success(`${quantity} ${product.name} added to the cart`);
      const isProductInCart = Boolean(
        prevCartItems.find((item) => item._id === product._id)
      );

      if (isProductInCart) {
        return cartItems.map((cartProduct) => {
          if (cartProduct._id === product._id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity,
            };
          }
          return cartProduct;
        });
      } else {
        return [...prevCartItems, { ...product, quantity }];
      }
    });
  };

  const onRemove = (product: IProduct, quantity: number) => {
    setCartItems((prevCartItems) => {
      const foundIndex = prevCartItems.findIndex(
        (item) => item._id === product._id
      );

      if (foundIndex !== -1) {
        const left = prevCartItems[foundIndex].quantity - quantity;
        if (left > 0) {
          return prevCartItems.map((item, index) => {
            if (foundIndex === index) {
              return { ...item, quantity: left };
            }
            return item;
          });
        }
        return [
          ...prevCartItems.slice(0, foundIndex),
          ...prevCartItems.slice(foundIndex + 1),
        ];
      }
      return prevCartItems;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setCartItems,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        onAdd,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
