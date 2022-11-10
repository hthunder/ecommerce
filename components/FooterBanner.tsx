import React from "react";
import Link from "next/link";

import { urlFor } from "../lib/client";
import Image from "next/image";

interface IFooterBanner {
  footerBanner: {
    [key: string]: any;
  };
}

export const FooterBanner: React.FC<IFooterBanner> = ({
  footerBanner: {
    discount,
    largeText1,
    largeText2,
    saleTime,
    smallText,
    midText,
    desc,
    product,
    buttonText,
    image,
  },
}) => {
  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <p>{discount}</p>
          <h3>{largeText1}</h3>
          <h3>{largeText2}</h3>
          <p>{saleTime}</p>
        </div>
        <div className="right">
          <p>{smallText}</p>
          <h3>{midText}</h3>
          <p>{desc}</p>
          <Link href={`/product/${product}`}>
            <button type="button">{buttonText}</button>
          </Link>
        </div>
        <Image
          className="footer-banner-image"
          src={urlFor(image).url()}
          alt="Изображение продукта"
          width="555"
          height="555"
        />
      </div>
    </div>
  );
};
