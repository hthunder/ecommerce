import Image from "next/image";
import Link from "next/link";
import React from "react";
import { urlFor } from "../lib/client";

interface IHeroBanner {
  heroBanner: {
    [key: string]: any;
  };
}

export const HeroBanner: React.FC<IHeroBanner> = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <div>
        <p className="beats-solo">{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <Image
          src={urlFor(heroBanner.image).url()}
          alt=""
          className="hero-banner-image"
          width={"555"}
          height={"555"}
        />
        <div>
          <Link href={`/product/${heroBanner.product}`}>
            <button type="button">{heroBanner.buttonText}</button>
          </Link>
          <div className="desc">
            <h5>Description</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
