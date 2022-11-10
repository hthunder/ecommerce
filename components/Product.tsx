import React from "react";
import Link from "next/link";

import { urlFor } from "../lib/client";
import Image from "next/image";

interface IProduct {
  product: { [key: string]: any };
}

export const Product: React.FC<IProduct> = ({
  product: { image, name, slug, price },
}) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <Image
            src={urlFor(image && image[0]).url()}
            width={250}
            height={250}
            alt={"Изображение товара"}
            className="product-image"
          />
          <p className="product-name">{name}</p>
          <p className="product-price">${price}</p>
        </div>
      </Link>
    </div>
  );
};
