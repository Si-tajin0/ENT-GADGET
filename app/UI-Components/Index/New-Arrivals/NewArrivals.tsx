'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import 'swiper/swiper.css'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import toast from 'react-hot-toast'; 
import Link from 'next/link';
import { FaHeart, FaCartPlus, FaStar, FaArrowRight } from 'react-icons/fa';

// হেল্পার এবং লোকাল ডাটা
import localProducts from '@/app/JsonData/Arraivles.json'; 
import { getStorageKey } from '@/app/utiles/storageHelper'; 

// টাইপ ইন্টারফেস
interface Product {
    _id?: string;
    Id?: number | string;
    image: string;
    title: string;
    price: string | number;
    sale?: string; 
    qty?: number;
    lessPrice?: string | number; 
    review?: string;
    sold?: string;
    createdAt?: string;
    [key: string]: unknown; 
}

const NewArrivals = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে NewArrivals ফেচ করা
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    
    const fetchDbProducts = async () => {
        try {
            const res = await fetch('/api/products?section=NewArrivals');
            if (res.ok) {
                const data = await res.json();
                setDbProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch New Arrivals from DB:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDbProducts();
    return () => clearTimeout(timer);
  }, []);

  // ২. ডাটা মার্জিং (নতুনগুলো আগে এবং ডুপ্লিকেট রিমুভ)
  const allNewArrivals = useMemo(() => {
      const combined = [
          ...dbProducts,
          ...(localProducts as Product[])
      ];
      
      const uniqueMap = new Map();
      combined.forEach(item => {
          const id = String(item._id || item.Id);
          if (!uniqueMap.has(id)) uniqueMap.set(id, item);
      });

      return Array.from(uniqueMap.values());
  }, [dbProducts]);

  // ৩. আইডি পাওয়ার নিরাপদ লজিক
  const getSafeId = useCallback((product: Product) => String(product._id || product.Id), []);

  // ৪. কার্ট লজিক (নিখুঁত ডুপ্লিকেট চেকিং)
  const handleAddToCart = (product: Product) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: Product[] = storedCart ? JSON.parse(storedCart) : [];

    const currentId = getSafeId(product);
    const isExist = cart.some((item) => getSafeId(item) === currentId);

    if (isExist) {
        toast.error(`${product.title} already in cart!`, { icon: '⚠️' });
    } else {
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!");
    }
  };

  // ৫. উইশলিস্ট লজিক
  const handleAddToWishlist = (product: Product) => {
    const wishlistKey = getStorageKey('wishlist');
    const storedWishlist = localStorage.getItem(wishlistKey);
    const wishlist: Product[] = storedWishlist ? JSON.parse(storedWishlist) : [];

    const currentId = getSafeId(product);
    if (wishlist.some((item) => getSafeId(item) === currentId)) {
      toast.error("Already in Wishlist!");
    } else {
      localStorage.setItem(wishlistKey, JSON.stringify([...wishlist, product]));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success("Added to Wishlist!");
    }
  };

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  if (!mounted) return null;

  return (
    <div className="px-[5%] lg:px-[12%] py-16 bg-[#fcfcfc] overflow-hidden">
        {/* টাইটেল সেকশন */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-3 block">
                    Just Landed in Store
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                    New <span className="text-red-600">Arrivals</span>.
                </h1>
            </div>
            <Link href="/UI-Components/Shop" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-all border-b-2 border-transparent hover:border-red-600 pb-1">
                Explore All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        
        <div className="w-full">
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-[2.5rem] h-[400px]"></div>)}
                </div>
            ) : (
                <Swiper
                    spaceBetween={25}
                    slidesPerView={4} 
                    loop={allNewArrivals.length > 4}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    modules={[Autoplay, Pagination]}
                    // স্লাইডারের ব্রেকপয়েন্ট এই অংশটুকু আপডেট করুন:
breakpoints={{
  1200: { slidesPerView: 5 },
  991: { slidesPerView: 3 },
  768: { slidesPerView: 2.5 },
  0: { slidesPerView: 1.5, spaceBetween: 15 } // মোবাইলে ১.৫টি স্লাইড দেখাবে
}}
                    className='h-full !pb-12'
                >
                    {allNewArrivals.map((product, index) => {
                        const uniqueID = getSafeId(product);
                        return (
                            <SwiperSlide key={uniqueID || index}> 
                                <div className="group border border-gray-100 rounded-[2.5rem] p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col h-full relative overflow-hidden">
                                    
                                    {/* Wishlist Button */}
                                    <button 
                                        onClick={() => handleAddToWishlist(product)}
                                        className="absolute top-5 left-5 w-10 h-10 bg-gray-50 text-gray-400 hover:text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer shadow-sm"
                                    >
                                        <FaHeart className="text-sm" />
                                    </button>

                                    {/* Image Area */}
                                    <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                                        <div className="relative flex items-center justify-center w-full h-48 overflow-hidden rounded-2xl bg-gray-50 mb-5">
                                            <img 
                                                src={product.image} 
                                                alt={product.title} 
                                                className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4' 
                                            />
                                            {product.sale && (
                                                <div className="absolute top-0 right-0"> 
                                                    <span className={`px-4 py-1.5 font-black text-[9px] uppercase text-white rounded-bl-2xl shadow-md ${product.sale === 'New' ? "bg-yellow-400 text-black" : "bg-red-600"}`}>
                                                        {product.sale}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Product Content */}
                                    <div className="flex-grow flex flex-col">
                                        <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                                            <h3 className='text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors h-10 mb-3 uppercase leading-tight tracking-tight'>
                                                {product.title}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-1 mb-4 bg-yellow-50 w-fit px-2 py-0.5 rounded text-yellow-600">
                                            <FaStar className="text-[10px]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{product.review || "NEW"}</span>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-black text-red-600 tracking-tighter leading-none">
                                                    {formatPrice(product.price)}
                                                </span>
                                                {product.lessPrice && (
                                                    <span className="text-[10px] text-gray-400 line-through font-bold mt-1 tracking-widest opacity-70">
                                                        {formatPrice(product.lessPrice)}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleAddToCart(product)}
                                                className='w-11 h-11 bg-black text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-90 cursor-pointer'
                                                title="Add to Cart"
                                            >
                                                <FaCartPlus className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
        </div>
    </div>
  )
}

export default NewArrivals;