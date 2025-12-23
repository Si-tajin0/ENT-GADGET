'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast'; 
import { FaCartPlus, FaStar, FaArrowRight, FaFire, FaHeart } from 'react-icons/fa';

// হেল্পার এবং ডাটা
import localProducts from '@/app/JsonData/BestSales.json'; 
import bestSalesBanner from '@/public/images/special-snacks-img.png';
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

const BestSales = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে ডাটা নিয়ে আসা
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const fetchDbProducts = async () => {
        try {
            const res = await fetch('/api/products?section=BestSales');
            if (res.ok) {
                const data = await res.json();
                setDbProducts(data);
            }
        } catch (error) {
            console.error("DB Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDbProducts();
    return () => clearTimeout(timer);
  }, []);

  // ২. ডাটা মার্জিং (নতুনগুলো আগে)
  const allBestSales = useMemo(() => {
      const combined = [...dbProducts, ...(localProducts as Product[])];
      const uniqueMap = new Map();
      combined.forEach(item => {
          const id = String(item._id || item.Id);
          if (!uniqueMap.has(id)) uniqueMap.set(id, item);
      });
      return Array.from(uniqueMap.values()).slice(0, 4);
  }, [dbProducts]);

  const getSafeId = useCallback((product: Product) => String(product._id || product.Id), []);

  // ৩. কার্ট লজিক (১টি শো করার সমস্যা ফিক্সড)
  const handleAddToCart = (product: Product) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: Product[] = storedCart ? JSON.parse(storedCart) : [];
    const currentId = getSafeId(product);
    
    if (cart.some((item) => getSafeId(item) === currentId)) {
        toast.error("Already in cart!", { icon: '⚠️' });
    } else {
        localStorage.setItem(cartKey, JSON.stringify([...cart, { ...product, qty: 1 }]));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!");
    }
  };

  // ৪. উইশলিস্ট লজিক
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
      toast.success("Saved to Wishlist!");
    }
  };

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  if (!mounted) return null;

  return (
    <div className="px-[5%] lg:px-[12%] py-16 bg-white">
        {/* হেডার */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-2 flex items-center gap-2">
                    <FaFire className="animate-pulse" /> Trending Now
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                    Best <span className="text-red-600">Sales</span>.
                </h1>
            </div>
            <Link href="/UI-Components/Shop" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-all border-b-2 border-transparent hover:border-red-600 pb-1">
                View Shop <FaArrowRight />
            </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
            
            {/* বাম পাশ: প্রোডাক্ট গ্রিড */}
            <div className='w-full lg:w-2/3'>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-50 animate-pulse rounded-[2rem] h-[180px]"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allBestSales.map((product) => {
                            const uniqueID = getSafeId(product);
                            return (
                                <div key={uniqueID} className="group flex bg-white border border-gray-100 rounded-[2rem] p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-red-100 relative h-full items-center">
                                    
                                    {/* উইশলিস্ট বাটন */}
                                    <button onClick={() => handleAddToWishlist(product)} className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition-colors z-10">
                                        <FaHeart className="text-sm" />
                                    </button>

                                    {/* ইমেজ (বাম পাশে ছোট সাইজ) */}
                                    <div className="w-[35%] aspect-square relative flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden p-2">
                                        <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110' />
                                        {product.sale && (
                                            <span className="absolute top-0 left-0 px-2 py-0.5 font-black text-[7px] uppercase text-white rounded-br-lg bg-red-600 shadow-sm">{product.sale}</span>
                                        )}
                                    </div>

                                    {/* কন্টেন্ট (ডান পাশে টাইট স্পেসিং) */}
                                    <div className="w-[65%] pl-4 flex flex-col justify-center">
                                        <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                                            <h3 className="text-[12px] font-bold text-gray-800 line-clamp-1 hover:text-red-600 transition-colors uppercase leading-none mb-1.5">{product.title}</h3>
                                            
                                            <div className="flex items-center gap-0.5 text-yellow-400 text-[9px] mb-2">
                                                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                                <span className="text-gray-400 font-bold ml-1">{product.review || "4.5"}</span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg font-black text-red-600 tracking-tighter leading-none">{formatPrice(product.price)}</span>
                                                {product.lessPrice && <span className="text-[9px] text-gray-400 line-through font-bold">{formatPrice(product.lessPrice)}</span>}
                                            </div>
                                        </Link>

                                        <button onClick={() => handleAddToCart(product)} className="w-full py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                                            Add to Bag <FaCartPlus className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ডান পাশ: প্রিমিয়াম ব্যানার */}
            <div className="w-full lg:w-1/3">
                <div className="p-8 rounded-[2.5rem] bg-black relative overflow-hidden flex flex-col justify-center items-center text-center shadow-2xl border border-gray-900 group h-full min-h-[400px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full -mr-16 -mt-16 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative z-10 w-full flex flex-col items-center">
                        <Image src={bestSalesBanner} alt='Banner' className='h-[200px] object-contain w-full mb-4 scale-110 group-hover:scale-125 transition-transform duration-1000' />
                        <h2 className='unbounded text-2xl text-white font-black leading-tight uppercase tracking-tighter mb-2'>Elite <span className="text-red-600">Control.</span></h2>
                        <p className='text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-6'>Pro Gaming Utility</p>
                        <Link href="/UI-Components/Shop" className='w-full'>
                            <button className='w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl shadow-red-900/20 uppercase text-[10px] tracking-widest'>Explore Deals <i className='bi bi-arrow-right ms-2'></i></button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BestSales;