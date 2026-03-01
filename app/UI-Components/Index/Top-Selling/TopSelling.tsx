'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast'; 
import { FaHeart, FaCartPlus, FaStar, FaArrowRight } from 'react-icons/fa';
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
    sold?: string | number; 
    createdAt?: string;
    category?: string;
}

const TopSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // আইডি পাওয়ার নিরাপদ লজিক (MongoDB _id)
  const getSafeId = useCallback((item: Product) => String(item._id || item.Id),[]);

  useEffect(() => {
    const fetchTopSelling = async () => {
        try {
            const res = await fetch('/api/products?section=TopSelling');
            
            if (res.ok) {
                const data: Product[] = await res.json();
                
                // === ম্যাজিক সর্টিং লজিক ===
                const sortedData = data.sort((a, b) => {
                    // any এরর ফিক্স করে সঠিক টাইপ দেওয়া হলো
                    const getSoldNumber = (soldVal: string | number | undefined) => {
                        if (!soldVal) return 0;
                        if (typeof soldVal === 'number') return soldVal;
                        const match = String(soldVal).match(/\d+/); 
                        return match ? parseInt(match[0], 10) : 0;
                    };

                    const soldA = getSoldNumber(a.sold);
                    const soldB = getSoldNumber(b.sold);

                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    
                    const now = new Date().getTime();
                    const sevenDays = 7 * 24 * 60 * 60 * 1000; // ৭ দিনের হিসাব

                    const isNewA = (now - dateA) < sevenDays;
                    const isNewB = (now - dateB) < sevenDays;

                    // ১. যদি A নতুন আপলোড হয় এবং B পুরনো হয়, তবে A আগে আসবে (Upload priority)
                    if (isNewA && !isNewB) return -1;
                    if (!isNewA && isNewB) return 1;

                    // ২. যদি দুটোই নতুন হয় বা দুটোই পুরনো হয়, তবে যার সেল (sold) বেশি সে আগে আসবে
                    if (soldB !== soldA) {
                        return soldB - soldA; 
                    }
                    
                    // ৩. যদি সেল সমান হয়, তবে সর্বশেষ আপলোড হওয়াটা আগে আসবে
                    return dateB - dateA; 
                });

                // === শুধু ৮টি প্রোডাক্ট (২ সারি) দেখাবে ===
                setProducts(sortedData.slice(0, 8));
            }
        } catch (error) {
            console.error("Failed to fetch TopSelling products", error);
        } finally {
            setLoading(false);
        }
    };

    fetchTopSelling();
  },[]);

  // কার্টে অ্যাড করার লজিক
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: Product[] = storedCart ? JSON.parse(storedCart) :[];

    const currentId = getSafeId(product);
    const isExist = cart.some((item) => getSafeId(item) === currentId);

    if (isExist) {
        toast.error(`${product.title.substring(0, 15)}... already in cart!`, { 
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
    } else {
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!", { icon: '🛍️' });
    }
  };

  // উইশলিস্ট লজিক
  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const wishlistKey = getStorageKey('wishlist');
    const storedWishlist = localStorage.getItem(wishlistKey);
    const wishlist: Product[] = storedWishlist ? JSON.parse(storedWishlist) :[];

    const currentId = getSafeId(product);
    const isExist = wishlist.some((item) => getSafeId(item) === currentId);

    if (isExist) {
      toast.error("Already in Wishlist!", { icon: '❤️' });
    } else {
      const updatedWishlist = [...wishlist, product];
      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success("Added to Wishlist!", { icon: '💖' });
    }
  };

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  const calculateDiscount = (price: string | number, lessPrice: string | number) => {
      const p = Number(String(price).replace(/[^0-9]/g, ""));
      const lp = Number(String(lessPrice).replace(/[^0-9]/g, ""));
      if (lp > p) {
          const discount = Math.round(((lp - p) / lp) * 100);
          return `-${discount}%`;
      }
      return null;
  };

  return (
    <div className="px-[5%] lg:px-[12%] py-16 bg-[#fcfcfc]">
      
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
        <Link href="/UI-Components/Shop?section=TopSelling" className="group flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-gray-500 hover:text-red-600 transition-all w-fit whitespace-nowrap bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md">
            View All Top Sellers <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform text-lg text-red-600"></i>
        </Link>
      </div>
      
      <div className="my-10">
        {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="h-80 bg-gray-100/80 animate-pulse rounded-[2.5rem] border border-gray-100"></div>)}
             </div>
        ) : products.length === 0 ? (
             <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                 <i className="bi bi-basket text-5xl text-gray-300 mb-4"></i>
                 <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Top selling items will appear here soon.</p>
             </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
                const uniqueID = getSafeId(product);
                const discountBadge = product.lessPrice ? calculateDiscount(product.price, product.lessPrice) : null;

                return (
                    <Link href={`/UI-Components/Shop?id=${uniqueID}`} key={uniqueID} className="group border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col relative overflow-hidden h-full">
                        
                        <button 
                            onClick={(e) => handleAddToWishlist(e, product)}
                            className="absolute top-4 left-4 md:top-5 md:left-5 w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur-md text-gray-400 hover:text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer shadow-sm border border-gray-100"
                        >
                            <FaHeart className="text-xs md:text-sm" />
                        </button>

                        <div className="relative flex items-center justify-center w-full h-32 md:h-48 overflow-hidden rounded-xl md:rounded-2xl bg-gray-50 mb-4 md:mb-5 border border-gray-50 group-hover:bg-red-50/30 transition-colors duration-500">
                            <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4 mix-blend-multiply' />
                            
                            {discountBadge ? (
                                <div className="absolute top-0 right-0"> 
                                    <span className="px-3 py-1 md:px-4 md:py-1.5 font-black text-[8px] md:text-[9px] uppercase text-white rounded-bl-xl md:rounded-bl-2xl shadow-md bg-red-600">
                                        {discountBadge} OFF
                                    </span>
                                </div>
                            ) : product.sale && (
                                <div className="absolute top-0 right-0"> 
                                    <span className={`px-3 py-1 md:px-4 md:py-1.5 font-black text-[8px] md:text-[9px] uppercase text-white rounded-bl-xl md:rounded-bl-2xl shadow-md ${product.sale === 'New' ? "bg-yellow-400 text-gray-900" : "bg-black"}`}>
                                        {product.sale}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow flex flex-col">
                            <h2 className='text-[11px] md:text-[13px] font-black text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors h-8 md:h-10 mb-2 md:mb-3 uppercase tracking-tight leading-tight'>
                                {product.title}
                            </h2>

                            <div className="flex items-center gap-1 mb-3 md:mb-4 bg-yellow-50 w-fit px-2 py-0.5 rounded text-yellow-600 border border-yellow-100">
                                <FaStar className="text-[8px] md:text-[10px]" />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{product.review || "5.0 Rating"}</span>
                            </div>

                            <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-lg md:text-2xl font-black text-red-600 tracking-tighter leading-none">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.lessPrice && (
                                        <span className="text-[9px] md:text-[10px] text-gray-400 line-through font-bold mt-1 tracking-widest opacity-70">
                                            {formatPrice(product.lessPrice)}
                                        </span>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className='w-9 h-9 md:w-11 md:h-11 bg-black text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-90 cursor-pointer group/cart'
                                >
                                    <FaCartPlus className="text-sm md:text-lg group-hover/cart:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </Link>
                );
            })}
            </div>
        )}
      </div>
    </div>
  )
}

export default TopSelling;