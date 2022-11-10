import React from "react";
import Head from "next/head";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface ILayout {
  children?: React.ReactNode;
}

export const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="layout">
      <Head>
        <title>JS Mastery Store</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
