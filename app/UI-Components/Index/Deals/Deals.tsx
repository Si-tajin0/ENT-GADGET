'use client'

import React, { useEffect, useState } from 'react'
import 'swiper/swiper.css'
import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import toast from 'react-hot-toast'; 

import Deal1 from '@/public/images/Deals-img1.webp';
import Deal2 from '@/public/images/Deals-img2.webp';
import Deal3 from '@/public/images/Deals-img3.webp';

import Link from 'next/link';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

import 'swiper/css/pagination';
import 'swiper/css/navigation';

export interface ProductType {
    _id?: string;        
    Id?: string | number; 
    image: string;
    title: string;
    price: string | number;
    lessPrice?: string | number;
    qty?: number; 
    createdAt?: string;
    review?: string;
}

const dealsData = [
    { image: Deal1, title:'get 5% cashback up to ৳5000', description: 'Starting at ৳1000', category: 'Earbuds' },
    { image: Deal2, title:'THE NEW 360 CAMERAS', description: 'Starting at ৳2499', category: 'Camera' },
    { image: Deal3, title:'kitchen appliances', description: 'Starting at ৳2000', category: 'Smart Home' },
];

const Deals = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const res = await fetch('/api/products?section=BestDeals');
        if (res.ok) {
          const data: ProductType[] = await res.json();
          const sortedData = data.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          setProducts(sortedData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching Deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestDeals();
  }, []);

  const handleAddToCart = (product: ProductType) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    let cart: ProductType[] = [];
    try {
        cart = storedCart ? JSON.parse(storedCart) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) { cart = []; }

    const currentId = String(product._id || product.Id);
    const isExist = cart.some((item) => String(item._id || item.Id) === currentId);

    if (isExist) {
        toast.error(`${product.title} already in cart!`, { icon: '⚠️' });
    } else {
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!");
    }
  };

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  return (
    <div className="px-[5%] lg:px-[12%] py-10 md:py-16 bg-[#fcfcfc]">
      <div className="mb-8 md:mb-14">
        <h1 className="text-3xl md:text-6xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-tight">
            Today&apos;s <span className="text-red-600">Best</span> <br className='hidden md:block' /> Deals<span className="text-red-600">.</span>
        </h1>
      </div>
      
      {/* ব্যানার স্লাইডার - বড় স্ক্রিনে ২টা দেখাবে */}
      <Swiper 
        slidesPerView={1} 
        spaceBetween={20} 
        loop={true} 
        modules={[Autoplay, Pagination]} 
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }} 
        speed={1000}
        breakpoints={{
          1024: { slidesPerView: 2, spaceBetween: 30 }, // বড় স্ক্রিন: ২টা
          768: { slidesPerView: 1.5, spaceBetween: 20 }, // ট্যাবলেট: ১.৫টা
          0: { slidesPerView: 1, spaceBetween: 15 },    // মোবাইল: ১টা
        }}
        className='deal-swiper !pb-12'
      >
        {dealsData.map((deal, index) => (
            <SwiperSlide key={index} className="h-auto">
               <div className="deals-wrap h-full p-6 md:p-10 rounded-[2.5rem] flex flex-row items-center justify-between gap-4 border border-gray-100 bg-white shadow-xl shadow-gray-100/50 group overflow-hidden">
                
                {/* ইমেজ সেকশন - আগের চেয়ে ছোট করা হয়েছে */}
                <div className="w-2/5 h-[120px] md:h-[180px] relative flex shrink-0 items-center justify-center">
                    <Image 
                        src={deal.image} 
                        alt={deal.title} 
                        fill
                        className='object-contain transition-transform duration-700 group-hover:scale-110'
                    />
                </div>

                {/* টেক্সট সেকশন */}
                <div className="w-3/5 flex flex-col justify-center text-left pl-2">
                    <h2 className='merienda font-black text-sm md:text-2xl uppercase tracking-tighter text-gray-800 mb-2 leading-tight'>
                        {deal.title}
                    </h2>
                    <p className='text-gray-400 font-bold text-[10px] md:text-sm tracking-tight mb-4 line-clamp-2 leading-snug'>{deal.description}</p>
                    <Link href={{ pathname: '/UI-Components/Shop', query: { category: deal.category } }}>
                        <button className="w-fit px-5 md:px-8 py-2 md:py-3 rounded-full text-white font-black bg-red-600 hover:bg-black transition-all shadow-lg text-[8px] md:text-[10px] uppercase tracking-widest">
                            Shop Now
                        </button>
                    </Link>
                </div>
               </div>
            </SwiperSlide>
        ))}
      </Swiper>

      {/* প্রোডাক্ট লিস্ট - মোবাইলে ২ কলাম গ্রিড */}
      <div className="mt-12 md:mt-16">
        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-64 md:h-80 bg-gray-100 animate-pulse rounded-[2rem]"></div>)}
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => {
                    const uniqueKey = String(product._id || product.Id);
                    return (
                        <div key={uniqueKey} className="group border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col relative overflow-hidden h-full">
                            <div className="relative flex items-center justify-center w-full h-32 md:h-52 overflow-hidden rounded-xl md:rounded-2xl bg-gray-50 mb-4">
                                <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-3'/>
                                
                                {/* কার্ট বাটন - মোবাইলে সবসময় দেখা যাবে (opacity-100) */}
                                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"> 
                                  <button 
                                      onClick={(e) => { e.preventDefault(); handleAddToCart(product); }} 
                                      className='w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-red-600 text-white rounded-full shadow-xl hover:bg-black active:scale-90 transition-all'
                                  >
                                    <i className='bi bi-cart-plus text-lg md:text-2xl'></i>
                                  </button>
                                </div>
                            </div>
                            <Link href={`/UI-Components/Shop?id=${uniqueKey}`} className="flex-grow flex flex-col">
                                <h2 className="text-[10px] md:text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 mb-2 h-7 md:h-10 uppercase leading-tight tracking-tight">{product.title}</h2>
                                <div className='mt-auto pt-2 border-t border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-1'>
                                    <div className="flex flex-col">
                                        {product.lessPrice && <span className="text-gray-400 text-[8px] md:text-[11px] line-through font-bold tracking-tight">{formatPrice(product.lessPrice)}</span>}
                                        <span className="text-sm md:text-2xl font-black text-red-600 tracking-tighter">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="hidden md:flex w-8 h-8 rounded-full border border-gray-100 items-center justify-center group-hover:bg-red-50 transition-all"><i className="bi bi-arrow-right-short text-gray-400 group-hover:text-red-600 text-xl"></i></div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}

export default Deals;