'use client'

import React, { useEffect, useState } from 'react'
import 'swiper/swiper.css'
import Image from 'next/image';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import toast from 'react-hot-toast'; 

import Deal1 from '@/public/images/Deals-img1.webp';
import Deal2 from '@/public/images/Deals-img2.webp';
import Deal3 from '@/public/images/Deals-img3.webp';

import Link from 'next/link';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

import 'swiper/css/pagination';

export interface ProductType {
    _id?: string;        
    Id?: string | number; 
    image: string;
    title: string;
    price: string | number;
    lessPrice?: string | number;
    qty?: number; 
    createdAt?: string; // Sort করার জন্য এটি দরকার
    category?: string;
}

// === ১. উপরের ৩টি ব্যানার (Local Data) ===
const dealsData =[
    { image: Deal1, title:'Get 5% Cashback up to ৳5000', description: 'Starting at ৳1000', category: 'Earbuds' },
    { image: Deal2, title:'The New 360 Cameras', description: 'Starting at ৳2499', category: 'Camera' },
    { image: Deal3, title:'Smart Kitchen Appliances', description: 'Starting at ৳2000', category: 'Smart Home' },
];

const Deals = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // === ২. Dynamic MongoDB Fetch & Sorting Logic ===
  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const res = await fetch('/api/products?section=BestDeals');
        if (res.ok) {
          const data: ProductType[] = await res.json();
          
          // === ম্যাজিক লজিক: নতুন আপলোড করা প্রোডাক্ট সবার আগে দেখাবে ===
          const sortedData = data.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Descending order (নতুন থেকে পুরনো)
          });
          
          // === শুধু ৫টি প্রোডাক্ট দেখাবে ===
          setProducts(sortedData.slice(0, 5)); 
        }
      } catch (error) {
        console.error("Error fetching Deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestDeals();
  },[]);

  // কার্টে অ্যাড করার লজিক 
  const handleAddToCart = (e: React.MouseEvent, product: ProductType) => {
    e.preventDefault(); 
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    let cart: ProductType[] =[];
    
    try {
        cart = storedCart ? JSON.parse(storedCart) : [];
        if (!Array.isArray(cart)) cart =[];
    } catch (e) { cart =[]; }

    const currentId = String(product._id || product.Id);
    const isExist = cart.some((item) => String(item._id || item.Id) === currentId);

    if (isExist) {
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

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9]/g, "");
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
    <div className="px-[5%] lg:px-[12%] py-10 md:py-16 bg-[#fcfcfc]">
      
      {/* === হেডার এবং View Hot Deals বাটন === */}
      <div className="mb-8 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-tight">
            Today&apos;s <span className="text-red-600">Best</span> <br className='hidden md:block' /> Deals<span className="text-red-600">.</span>
        </h1>
        
        {/* View Hot Deals Button (খুব সুন্দর করে ফোকাস করা হয়েছে) */}
        <Link href="/UI-Components/Shop?section=BestDeals" className="group flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-gray-500 hover:text-red-600 transition-all w-fit whitespace-nowrap bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md">
            View Hot Deals <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform text-lg text-red-600"></i>
        </Link>
      </div>
      
      {/* === TOP OFFER SLIDERS (Local Data) === */}
      <Swiper 
        slidesPerView={1} 
        spaceBetween={20} 
        loop={true} 
        modules={[Autoplay, Pagination]} 
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }} 
        speed={1000}
        breakpoints={{
          1024: { slidesPerView: 2, spaceBetween: 30 }, 
          768: { slidesPerView: 1.5, spaceBetween: 20 },
        }}
        className='deal-swiper !pb-12'
      >
        {dealsData.map((deal, index) => (
            <SwiperSlide key={index} className="h-auto">
               <div className="deals-wrap h-full p-6 md:p-10 rounded-[2.5rem] flex flex-row items-center justify-between gap-4 border border-gray-100 bg-white shadow-xl shadow-gray-100/50 group overflow-hidden">
                <div className="w-2/5 h-[120px] md:h-[180px] relative flex shrink-0 items-center justify-center">
                    <Image 
                        src={deal.image} alt={deal.title} fill
                        className='object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl'
                    />
                </div>
                <div className="w-3/5 flex flex-col justify-center text-left pl-2">
                    <h2 className='font-black text-sm md:text-xl uppercase tracking-tighter text-gray-800 mb-2 leading-tight unbounded'>
                        {deal.title}
                    </h2>
                    <p className='text-gray-400 font-bold text-[10px] md:text-sm tracking-widest mb-4 uppercase'>{deal.description}</p>
                    <Link href={{ pathname: '/UI-Components/Shop', query: { category: deal.category } }}>
                        <button className="w-fit px-6 py-3 rounded-full text-white font-black bg-red-600 hover:bg-black transition-all shadow-lg text-[10px] uppercase tracking-widest active:scale-95">
                            Shop Offer <i className="bi bi-arrow-right ml-1"></i>
                        </button>
                    </Link>
                </div>
               </div>
            </SwiperSlide>
        ))}
      </Swiper>

      {/* === DYNAMIC BEST DEALS PRODUCTS (MongoDB) === */}
      <div className="mt-12 md:mt-16">
        {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-64 md:h-80 bg-gray-100/80 animate-pulse rounded-[2rem] border border-gray-100"></div>)}
            </div>
        ) : products.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <i className="bi bi-box-seam text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">New deals are coming soon!</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => {
                    const uniqueKey = String(product._id);
                    const discountBadge = product.lessPrice ? calculateDiscount(product.price, product.lessPrice) : null;

                    return (
                        <Link href={`/UI-Components/Shop?id=${uniqueKey}`} key={uniqueKey} className="group border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-5 bg-white shadow-sm hover:shadow-2xl hover:shadow-red-100/50 transition-all duration-500 hover:border-red-100 flex flex-col relative overflow-hidden h-full">
                            
                            {/* অটোমেটিক ডিসকাউন্ট ব্যাজ */}
                            {discountBadge && (
                                <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                                    {discountBadge}
                                </div>
                            )}

                            <div className="relative flex items-center justify-center w-full h-32 md:h-48 overflow-hidden rounded-xl md:rounded-2xl bg-gray-50 mb-4 group-hover:bg-red-50/30 transition-colors duration-500">
                                <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4 mix-blend-multiply'/>
                                
                                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20"> 
                                  <button 
                                      onClick={(e) => handleAddToCart(e, product)} 
                                      className='w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black text-white rounded-full shadow-xl hover:bg-red-600 active:scale-90 transition-all'
                                  >
                                    <i className='bi bi-cart-plus text-lg md:text-xl'></i>
                                  </button>
                                </div>
                            </div>
                            
                            <div className="flex-grow flex flex-col">
                                <h2 className="text-[11px] md:text-[13px] font-black text-gray-800 line-clamp-2 group-hover:text-red-600 mb-2 uppercase leading-snug tracking-tighter transition-colors">
                                    {product.title}
                                </h2>
                                <div className='mt-auto pt-3 border-t border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-1'>
                                    <div className="flex flex-col">
                                        {product.lessPrice && <span className="text-gray-400 text-[10px] line-through font-bold tracking-tight">{formatPrice(product.lessPrice)}</span>}
                                        <span className="text-base md:text-xl font-black text-red-600 tracking-tighter">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="hidden md:flex w-8 h-8 rounded-full border-2 border-gray-100 items-center justify-center group-hover:border-red-600 group-hover:bg-red-600 transition-all">
                                        <i className="bi bi-arrow-right-short text-gray-400 group-hover:text-white text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}

export default Deals;