import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
// import { useRouter } from "next/router";
import { runFireworks } from "../lib/utils";

import { useStateContext } from "../context/StateContext";

const Success = () => {
  const { setCartItems } = useStateContext()!;
  //   const [order, setOrder] = useState(null);

  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    runFireworks();
  }, []);

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox for the receipt</p>
        <p className="description">
          If you have any questions, please email{" "}
          <a href="mailto:order@example.com" className="email">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <button type="button" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
