'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link';
import toast from 'react-hot-toast'; 
import 'swiper/css'
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaHeart, FaCartPlus, FaFire, FaArrowRight, FaClock } from 'react-icons/fa';

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
    createdAt?: string;
}

const HotDeals = () => {
  const[products, setProducts] = useState<Product[]>([]);
  const [biggestDeal, setBiggestDeal] = useState<{ product: Product, discount: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  const getSafeId = useCallback((product: Product) => String(product._id || product.Id),[]);

  // Timer Effect (Resets every night at midnight)
  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Tonight at 11:59:59 PM
        const diff = endOfDay.getTime() - now.getTime();

        if (diff > 0) {
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setTimeLeft({ h, m, s });
        }
    }, 1000);

    return () => clearInterval(timer);
  },[]);

  useEffect(() => {
    setMounted(true);
    
    const fetchHotDeals = async () => {
        try {
            const res = await fetch('/api/products?section=HotDeals');
            if (res.ok) {
                const data: Product[] = await res.json();
                
                // Sort by latest
                const sortedData = data.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; 
                });

                // --- AUTO BIGGEST DEAL LOGIC ---
                let maxDiscount = 0;
                let bestItem = sortedData[0] || null;

                sortedData.forEach(item => {
                   const currentPrice = Number(String(item.price).replace(/[^0-9.]/g, ""));
                   const oldPrice = item.lessPrice ? Number(String(item.lessPrice).replace(/[^0-9.]/g, "")) : 0;
                   
                   if (oldPrice > currentPrice) {
                       const discountPercentage = ((oldPrice - currentPrice) / oldPrice) * 100;
                       if (discountPercentage > maxDiscount) {
                           maxDiscount = discountPercentage;
                           bestItem = item;
                       }
                   }
                });

                if (bestItem) {
                    setBiggestDeal({ product: bestItem, discount: Math.round(maxDiscount) });
                }

                setProducts(sortedData.slice(0, 10));
            }
        } catch (error) {
            console.error("Failed to fetch Hot Deals:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchHotDeals();
  }, [getSafeId]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: Product[] = storedCart ? JSON.parse(storedCart) :[];
    const currentId = getSafeId(product);
    
    if (cart.some((item) => getSafeId(item) === currentId)) {
        toast.error(`${product.title.substring(0, 15)}... is already in cart!`, { 
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
    } else {
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!", { icon: '🛍️' });
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const wishlistKey = getStorageKey('wishlist');
    const storedWishlist = localStorage.getItem(wishlistKey);
    const wishlist: Product[] = storedWishlist ? JSON.parse(storedWishlist) :[];
    const currentId = getSafeId(product);

    if (wishlist.some((item) => getSafeId(item) === currentId)) {
      toast.error("Already in Wishlist!", { icon: '❤️' });
    } else {
      localStorage.setItem(wishlistKey, JSON.stringify([...wishlist, product]));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success("Added to Wishlist!", { icon: '💖' });
    }
  };

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  if (!mounted) return null;

  return (
    <div className="px-[5%] lg:px-[12%] py-16 bg-[#fcfcfc] overflow-hidden">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-3 flex items-center gap-2">
                    <FaFire className="animate-pulse" /> Flash Sale is Live
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                    Today&apos;s <span className="text-red-600">Hot</span> Deals.
                </h1>
            </div>
            <Link href="/UI-Components/Shop?section=HotDeals" className="group flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-gray-500 hover:text-red-600 transition-all w-fit whitespace-nowrap bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md">
                View All Hot Deals <FaArrowRight className="group-hover:translate-x-1 transition-transform text-lg text-red-600" />
            </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
            
            {/* Left Dynamic Biggest Deal Banner */}
            <div className="w-full lg:w-[30%] p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center bg-black relative overflow-hidden group shadow-2xl shrink-0 h-[480px]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600 rounded-full -mr-16 -mt-16 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
                
                {loading ? (
                    <div className="animate-pulse flex flex-col items-center w-full">
                        <div className="w-32 h-32 bg-gray-800 rounded-full mb-6"></div>
                        <div className="w-3/4 h-6 bg-gray-800 rounded mb-4"></div>
                        <div className="w-1/2 h-4 bg-gray-800 rounded mb-8"></div>
                        <div className="w-full h-12 bg-gray-800 rounded-full"></div>
                    </div>
                ) : biggestDeal ? (
                    <div className="relative z-10 w-full flex flex-col items-center mt-2">
                        {/* Discount Badge */}
                        {biggestDeal.discount > 0 && (
                            <span className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-bl-2xl rounded-tr-xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                                SAVE {biggestDeal.discount}%
                            </span>
                        )}

                        {/* Product Image */}
                        <div className="h-[150px] w-full flex justify-center items-center mb-6 relative">
                            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl scale-150"></div>
                            <img 
                                src={biggestDeal.product.image} 
                                alt={biggestDeal.product.title} 
                                className='max-h-full object-contain relative z-10 drop-shadow-2xl scale-110 group-hover:scale-125 transition-transform duration-700' 
                            />
                        </div>

                        {/* Product Title */}
                        <h2 className='unbounded text-xl text-white mb-2 font-black leading-tight uppercase tracking-tighter line-clamp-2 px-2'>
                            {biggestDeal.product.title}
                        </h2>
                        <p className='text-red-500 font-black text-2xl mb-4 tracking-tighter'> 
                            {formatPrice(biggestDeal.product.price)}
                        </p>

                        {/* Countdown Timer */}
                        <div className="w-full mb-6 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2">
                                <FaClock className="text-gray-400 text-[10px]" />
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Offer Ends In</span>
                            </div>
                            <div className="flex gap-3 text-white">
                                <div className="bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 flex flex-col items-center min-w-[50px]">
                                    <span className="text-xl font-black">{timeLeft.h.toString().padStart(2, '0')}</span>
                                    <span className="text-[8px] uppercase tracking-widest text-gray-400">Hrs</span>
                                </div>
                                <span className="text-xl font-black self-center text-red-600 animate-pulse">:</span>
                                <div className="bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 flex flex-col items-center min-w-[50px]">
                                    <span className="text-xl font-black">{timeLeft.m.toString().padStart(2, '0')}</span>
                                    <span className="text-[8px] uppercase tracking-widest text-gray-400">Min</span>
                                </div>
                                <span className="text-xl font-black self-center text-red-600 animate-pulse">:</span>
                                <div className="bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 flex flex-col items-center min-w-[50px]">
                                    <span className="text-xl font-black">{timeLeft.s.toString().padStart(2, '0')}</span>
                                    <span className="text-[8px] uppercase tracking-widest text-gray-400">Sec</span>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Claim Offer Link */}
                        <Link href={`/UI-Components/Shop?id=${getSafeId(biggestDeal.product)}`} className="w-full">
                            <button className='w-full px-8 py-4 bg-red-600 text-white font-black rounded-full hover:bg-white hover:text-black transition-all duration-500 uppercase text-[10px] tracking-widest active:scale-95 shadow-xl group/btn overflow-hidden relative'>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Claim This Deal <i className='bi bi-lightning-fill group-hover/btn:text-red-600'></i>
                                </span>
                            </button>
                        </Link>
                    </div>
                ) : null}
            </div>

            {/* Right Slider Section */}
            <div className='w-full lg:w-[70%]'>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                        {[1, 2, 3].map(i => <div key={i} className="bg-gray-100/80 animate-pulse rounded-[2.5rem] h-[480px] border border-gray-100"></div>)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <FaFire className="text-5xl text-gray-300 mb-4" />
                        <p className="text-gray-400 font-bold text-sm tracking-widest uppercase text-center px-4">Flash sale products will appear here soon.</p>
                    </div>
                ) : (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3} 
                        loop={products.length > 3} 
                        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        modules={[Autoplay, Pagination]}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        breakpoints={{ 
                            1024: { slidesPerView: 3 },
                            768: { slidesPerView: 2 },
                            0: { slidesPerView: 1.2 }
                        }}
                        className='h-full !pb-12'
                    >
                        {products.map((product) => {
                            const uniqueID = getSafeId(product);

                            return (
                                <SwiperSlide key={uniqueID} className="h-auto"> 
                                    <Link href={`/UI-Components/Shop?id=${uniqueID}`} className="group border border-gray-100 rounded-[2.5rem] p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col h-[430px] relative overflow-hidden block">
                                        
                                        <button 
                                            onClick={(e) => handleAddToWishlist(e, product)} 
                                            className="absolute top-5 left-5 w-9 h-9 bg-white/80 backdrop-blur-md text-gray-400 hover:text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-sm border border-gray-100 cursor-pointer"
                                        >
                                            <FaHeart className="text-xs" />
                                        </button>

                                        <div className="relative flex items-center justify-center w-full h-48 overflow-hidden rounded-2xl bg-gray-50 mb-4 group-hover:bg-red-50/30 transition-colors">
                                            <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4 mix-blend-multiply' />
                                            {product.sale && (
                                                <span className="absolute top-0 right-0 px-4 py-1.5 font-black text-[9px] uppercase text-white rounded-bl-2xl shadow-md bg-red-600">
                                                    {product.sale}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-grow flex flex-col">
                                            <h3 className='text-[12px] font-bold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors h-9 mb-3 uppercase leading-snug tracking-tighter'>
                                                {product.title}
                                            </h3>

                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-xl md:text-2xl font-black text-red-600 tracking-tighter leading-none">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.lessPrice && (
                                                        <span className="text-[10px] text-gray-400 line-through font-bold mt-1 tracking-widest opacity-70">
                                                            {formatPrice(product.lessPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, product)} 
                                                    className='w-10 h-10 md:w-11 md:h-11 bg-black text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-90 cursor-pointer group/cart z-20 relative'
                                                >
                                                    <FaCartPlus className="text-md md:text-lg group-hover/cart:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
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