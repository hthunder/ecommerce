import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

import { client, urlFor } from "../../lib/client";
import getStripe from "../../lib/getStripe";
import { ICartProduct, IProduct } from "../../types/";

interface IProductDetailsProps {
  products: IProduct[];
  product: IProduct;
}

const ProductDetails: NextPage<IProductDetailsProps> = (props) => {
  const { products, product } = props;
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);

  const [qty, setQty] = useState(1);
  const decQty = () =>
    setQty((prevQty) => (prevQty - 1 < 0 ? prevQty : prevQty - 1));
  const incQty = () => setQty((prevQty) => prevQty + 1);
  const resetQty = () => setQty(1);

  const { onAdd } = useStateContext()!;

  const handleCheckout = async () => {
    const cartProduct: ICartProduct = { ...product, quantity: qty };
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: [cartProduct] }),
    });

    if (response.status === 500) return;
    const data = await response.json();

    toast.loading("Redirecting...");
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <Image
              src={urlFor(image && image[index]).url()}
              width="555"
              height="555"
              alt="Товар"
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <Image
                key={item._key}
                src={urlFor(item).url()}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => {
                  setIndex(i);
                }}
                width="100"
                height="100"
                alt="Маленькое превью товара"
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">
                {qty}
              </span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                onAdd(product, qty);
                resetQty();
              }}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleCheckout}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

  const products: {
    slug: { current: string };
  }[] = await client.fetch(query);

  const paths = products.map((product) => {
    return {
      params: {
        slug: product.slug.current,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<IProductDetailsProps> = async (
  context
) => {
  const { slug } = context.params!;

  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: {
      products,
      product,
    },
  };
};

export default ProductDetails;
