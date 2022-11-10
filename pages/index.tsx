import React from "react";
import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";
import { IProduct } from "../types";

interface IHome {
  products: IProduct[];
  bannerData: {
    [key: string]: any;
  }[];
}

const Home: React.FC<IHome> = ({ products, bannerData }) => {
  return (
    <div>
      {bannerData.length ? <HeroBanner heroBanner={bannerData[0]} /> : null}
      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      {bannerData && <FooterBanner footerBanner={bannerData[0]} />}
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData },
  };
};

export default Home;
