'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast'; 
import { FaHeart, FaCartPlus, FaStar, FaArrowRight } from 'react-icons/fa';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

// লোকাল JSON ডাটা ইমপোর্ট
import productsData from '@/app/JsonData/TopSelling.json'; 

interface Product {
    _id?: string;        
    Id: number | string; 
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

const TopSelling = () => {
  // ১. সরাসরি ইনিশিয়াল ভ্যালু সেট করে দেওয়া ভালো যদি ডাটা স্ট্যাটিক হয়
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // ২. আইডি পাওয়ার নিরাপদ লজিক
  const getSafeId = useCallback((item: Product) => String(item._id || item.Id), []);

  useEffect(() => {
    // এরর ফিক্স: সরাসরি সেট না করে একটি ছোট ডিলে বা নেক্সট টিকে সেট করা হচ্ছে
    const timer = setTimeout(() => {
        setMounted(true);
        
        // JSON ডাটা সর্ট এবং স্লাইস
        const sorted = [...(productsData as Product[])].reverse(); 
        setProducts(sorted.slice(0, 12));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ৩. কার্টে অ্যাড করার লজিক
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

  // ৪. উইশলিস্ট লজিক
  const handleAddToWishlist = (product: Product) => {
    const wishlistKey = getStorageKey('wishlist');
    const storedWishlist = localStorage.getItem(wishlistKey);
    const wishlist: Product[] = storedWishlist ? JSON.parse(storedWishlist) : [];

    const currentId = getSafeId(product);
    const isExist = wishlist.some((item) => getSafeId(item) === currentId);

    if (isExist) {
      toast.error("Already in Wishlist!");
    } else {
      const updatedWishlist = [...wishlist, product];
      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
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
    <div className="px-[5%] lg:px-[12%] py-16 bg-white">
      {/* Title Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-3 block">
                Top Picks
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                Top <span className="text-red-600">Selling</span> Items.
            </h2>
        </div>
        <Link href="/UI-Components/Shop" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-all">
            Explore Store <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
            const uniqueID = getSafeId(product);
            return (
                <div key={uniqueID || index} className="group border border-gray-100 rounded-[2.5rem] p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col relative overflow-hidden h-full">
                    
                    <button 
                        onClick={() => handleAddToWishlist(product)}
                        className="absolute top-5 left-5 w-10 h-10 bg-gray-50 text-gray-400 hover:text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer"
                    >
                        <FaHeart className="text-sm" />
                    </button>

                    <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                        <div className="relative flex items-center justify-center w-full h-48 overflow-hidden rounded-2xl bg-gray-50 mb-5 border border-gray-50">
                            <Image src={product.image} alt={product.title} width={180} height={180} className='object-contain transition-transform duration-700 group-hover:scale-110 p-4' unoptimized />
                            {product.sale && (
                                <div className="absolute top-0 right-0"> 
                                    <span className={`px-4 py-1.5 font-black text-[9px] uppercase text-white rounded-bl-2xl shadow-md ${product.sale === 'New' ? "bg-yellow-400 text-gray-900" : "bg-red-600"}`}>
                                        {product.sale}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Link>

                    <div className="flex-grow flex flex-col">
                        <Link href={`/UI-Components/Shop?id=${uniqueID}`}>
                            <h2 className='text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors h-10 mb-3 uppercase tracking-tight leading-tight'>
                                {product.title}
                            </h2>
                        </Link>

                        <div className="flex items-center gap-1 mb-4 bg-yellow-50 w-fit px-2 py-0.5 rounded text-yellow-600">
                            <FaStar className="text-[10px]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{product.review || "15 Reviews"}</span>
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
                            >
                                <FaCartPlus className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>
      </div>
    </div>
  )
}

export default TopSelling;