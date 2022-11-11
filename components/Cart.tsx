import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";
import Image from "next/image";
import { PaymentService } from "../services/PaymentService";

export const Cart = () => {
  const cartRef = useRef<HTMLDivElement>(null);
  const {
    cartItems,
    setShowCart,
    onAdd,
    onRemove,
    totalPrice,
    totalQuantities,
  } = useStateContext()!;
  const router = useRouter();

  const handleCheckout = async () => {
    const paymentService = new PaymentService("/api/ukassa");
    const url = await paymentService.create(cartItems);
    router.push(url);
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          className="cart-heading"
          type="button"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 && (
            <>
              {cartItems.map((item, index) => {
                return (
                  <div className="product" key={item._id}>
                    <Image
                      className="cart-product-image"
                      src={urlFor(item?.image[0]).url()}
                      width="180"
                      height="150"
                      alt="Изображение товара в корзине"
                    />
                    <div className="item-desc">
                      <div className="flex top">
                        <h5>{item.name}</h5>
                        <h4>${item.price}</h4>
                      </div>
                      <div className="flex bottom">
                        <div>
                          <p className="quantity-desc">
                            <span
                              className="minus"
                              onClick={() => {
                                onRemove(item, 1);
                              }}
                            >
                              <AiOutlineMinus />
                            </span>
                            <span className="num">{item.quantity}</span>
                            <span
                              className="plus"
                              onClick={() => {
                                onAdd(item, 1);
                              }}
                            >
                              <AiOutlinePlus />
                            </span>
                          </p>
                        </div>{" "}
                        <button
                          className="remove-item"
                          type="button"
                          onClick={() => {
                            onRemove(item, item.quantity);
                          }}
                        >
                          <TiDeleteOutline />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="cart-bottom">
                <div className="total">
                  <h3>Subtotal:</h3>
                  <h3>${totalPrice}</h3>
                </div>
              </div>
              <div className="btn-container">
                <button className="btn" type="button" onClick={handleCheckout}>
                  Pay
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
