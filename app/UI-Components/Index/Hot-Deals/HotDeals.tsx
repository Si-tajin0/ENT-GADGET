'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast'; 
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaHeart, FaCartPlus, FaFire, FaArrowRight } from 'react-icons/fa';

// হেল্পার এবং ডাটা
import localProducts from '@/app/JsonData/HotDeals.json'; 
import HotDealBanner from '@/public/images/hot-deals-img.png';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

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

const HotDeals = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে HotDeals ফেচ করা
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    
    const fetchDbProducts = async () => {
        try {
            const res = await fetch('/api/products?section=HotDeals');
            if (res.ok) {
                const data = await res.json();
                setDbProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch database products:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDbProducts();
    return () => clearTimeout(timer);
  }, []);

  // ২. JSON এবং ডাটাবেস ডাটা মার্জ করা (নতুনগুলো আগে)
  const allHotDeals = useMemo(() => {
      const combined = [
          ...dbProducts,
          ...(localProducts as Product[])
      ];
      // আইডি অনুযায়ী ডুপ্লিকেট রিমুভ এবং সর্টিং
      const uniqueMap = new Map();
      combined.forEach(item => {
          const id = String(item._id || item.Id);
          if (!uniqueMap.has(id)) uniqueMap.set(id, item);
      });
      return Array.from(uniqueMap.values());
  }, [dbProducts]);

  const getSafeId = useCallback((product: Product) => String(product._id || product.Id), []);

  const handleAddToCart = (product: Product) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: Product[] = storedCart ? JSON.parse(storedCart) : [];
    const currentId = getSafeId(product);
    
    if (cart.some((item) => getSafeId(item) === currentId)) {
        toast.error(`${product.title} is already in cart!`, { icon: '⚠️' });
    } else {
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!");
    }
  };

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
    <div className="px-[5%] lg:px-[12%] py-16 bg-white overflow-hidden">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-3 flex items-center gap-2">
                    <FaFire className="animate-pulse" /> Flash Sale is Live
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                    Today&apos;s <span className="text-red-600">Hot</span> Deals.
                </h1>
            </div>
            <Link href="/UI-Components/Shop" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-all border-b-2 border-gray-100 hover:border-red-600 pb-1">
                View All Deals <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
            {/* বামদিকের বড় ব্যানার */}
            <div className="w-full lg:w-[30%] p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center bg-black relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full -mr-16 -mt-16 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative z-10 w-full">
                    <Image src={HotDealBanner} alt='Hot Deal' className='h-[200px] object-contain w-full mb-8 scale-110 group-hover:scale-125 transition-transform duration-700' />
                    <h2 className='unbounded text-2xl text-white mb-3 font-black leading-tight uppercase tracking-tighter'>
                        Pro Gaming <br /> <span className="text-red-600">Powerhouse</span>
                    </h2>
                    <p className='text-gray-500 font-bold mb-8 text-xs uppercase tracking-widest'> 
                        Performance meets style.
                    </p>
                    <Link href="/UI-Components/Shop">
                        <button className='w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all duration-500 uppercase text-[10px] tracking-widest'>
                            Claim Now <i className='bi bi-lightning-fill ms-1'></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* ডানদিকের স্লাইডার */}
            <div className='w-full lg:w-[70%]'>
                {loading ? (
                    <div className="grid grid-cols-3 gap-6 h-full">
                        {[1, 2, 3].map(i => <div key={i} className="bg-gray-50 animate-pulse rounded-[2.5rem] h-[450px]"></div>)}
                    </div>
                ) : (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3} 
                        loop={allHotDeals.length > 3}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        modules={[Autoplay, Pagination]}
                        breakpoints={{ 
                            1200: { slidesPerView: 3 },
                            768: { slidesPerView: 2 },
                            0: { slidesPerView: 1.2 }
                        }}
                        className='h-full !pb-10'
                    >
                        {allHotDeals.map((product, index) => {
                            const uniqueID = getSafeId(product);
                            const [soldCount, totalCount] = String(product.sold || "0/1").split('/').map(Number);
                            const percentage = Math.min((soldCount / (totalCount || 1)) * 100, 100);

                            return (
                                <SwiperSlide key={uniqueID || index}> 
                                    <div className="group border border-gray-100 rounded-[2.5rem] p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col h-full relative overflow-hidden">
                                        
                                        <button onClick={() => handleAddToWishlist(product)} className="absolute top-5 left-5 w-9 h-9 bg-gray-50 text-gray-400 hover:text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-sm cursor-pointer"><FaHeart className="text-xs" /></button>

                                        <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                                            <div className="relative flex items-center justify-center w-full h-44 overflow-hidden rounded-2xl bg-gray-50 mb-4">
                                                <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4' />
                                                {product.sale && <span className="absolute top-0 right-0 px-4 py-1.5 font-black text-[9px] uppercase text-white rounded-bl-2xl shadow-md bg-red-600">{product.sale}</span>}
                                            </div>
                                        </Link>

                                        <div className="flex-grow flex flex-col">
                                            <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                                                <h3 className='text-[12px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors h-9 mb-3 uppercase leading-tight tracking-tight'>
                                                    {product.title}
                                                </h3>
                                            </Link>

                                            {product.sold && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 mb-1.5">
                                                        <span>Available: {totalCount - soldCount}</span>
                                                        <span className="text-red-600 font-black">Sold: {soldCount}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-red-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-black text-red-600 tracking-tighter leading-none">{formatPrice(product.price)}</span>
                                                    {product.lessPrice && <span className="text-[10px] text-gray-400 line-through font-bold mt-1">{formatPrice(product.lessPrice)}</span>}
                                                </div>
                                                <button onClick={() => handleAddToCart(product)} className='w-10 h-10 bg-black text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-90 cursor-pointer'><FaCartPlus className="text-md" /></button>
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
    </div>
  )
}

export default HotDeals;