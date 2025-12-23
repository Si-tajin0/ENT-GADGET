'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from "next/navigation";

// JSON ডাটা ইমপোর্ট
import Arraivles from "@/app/JsonData/Arraivles.json";
import BestSales from "@/app/JsonData/BestSales.json";
import HotDeals from "@/app/JsonData/HotDeals.json";
import TopSelling from "@/app/JsonData/TopSelling.json";
import ShortProducts from "@/app/JsonData/ShortProducts.json";

import Products from "./Products/Products";
import ProductDetails, { ProductType } from './ProductsDetails/ProductDetails';

// ShortProducts JSON এর গঠনের জন্য একটি ইন্টারফেস
interface ShortProductsStructure {
  Featured?: ProductType[];
  OnSale?: ProductType[];
  TopSelling?: ProductType[];
  TopRated?: ProductType[];
}

const ShopContent = () => {
  const [dbProducts, setDbProducts] = useState<ProductType[]>([]);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  // ১. ডাটাবেস থেকে ডাটা নিয়ে আসা (any ছাড়া)
  useEffect(() => {
    const fetchDB = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data: ProductType[] = await res.json();
          setDbProducts(data);
        }
      } catch (error: unknown) {
        console.error("Error fetching DB products", error);
      }
    };
    fetchDB();
  }, []);

  // ২. সব ডাটা মার্জ করা (any ছাড়া)
  const allProducts: ProductType[] = useMemo(() => {
    // JSON ডাটাগুলোকে টাইপ কাস্টিং করা
    const jsonProducts: ProductType[] = [
      ...(Arraivles as ProductType[]),
      ...(BestSales as ProductType[]),
      ...(HotDeals as ProductType[]),
      ...(TopSelling as ProductType[]),
    ];

    // ShortProducts এর ভেতর থেকে ডাটা বের করা (any ছাড়া)
    const shortData = ShortProducts as ShortProductsStructure;
    const extraProducts: ProductType[] = [
      ...(shortData.Featured || []),
      ...(shortData.OnSale || []),
      ...(shortData.TopSelling || []),
      ...(shortData.TopRated || []),
    ];

    return [...jsonProducts, ...extraProducts, ...dbProducts];
  }, [dbProducts]);

  return (
    <div className='min-h-screen bg-white'>
      {productId ? (
        <ProductDetails id={productId} products={allProducts} />
      ) : (
        <Products />
      )}
    </div>
  );
};

// Next.js-এ useSearchParams ব্যবহার করলে Suspense দিয়ে র‍্যাপ করা ভালো
const ShopPage = () => {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
};

export default ShopPage;