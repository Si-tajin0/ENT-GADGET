'use client'

import React, { useEffect, useState } from 'react'
import 'swiper/swiper.css'
import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import toast from 'react-hot-toast'; 

import Deal1 from '@/public/images/Deals-img1.webp';
import Deal2 from '@/public/images/Deals-img2.webp';
import Deal3 from '@/public/images/Deals-img3.webp';

import Link from 'next/link';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

export interface ProductType {
    _id?: string;        // ডাটাবেস আইডি
    Id?: string | number; // লোকাল আইডি
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
          // নতুন প্রোডাক্ট আগে দেখানোর জন্য সর্টিং
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

  // Deals.tsx ফাইলের handleAddToCart ফাংশনটি এই কোড দিয়ে রিপ্লেস করুন
const handleAddToCart = (product: ProductType) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    let cart: ProductType[] = [];

    try {
        cart = storedCart ? JSON.parse(storedCart) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }

    // ডাটাবেস থেকে আসলে _id নেবে, JSON থেকে আসলে Id নেবে
    // এটি string এ কনভার্ট করা খুব জরুরি
    const currentId = String(product._id || product.Id);

    // চেক করা হচ্ছে এই আইডি কার্টে আছে কি না
    const isExist = cart.some((item) => String(item._id || item.Id) === currentId);

    if (isExist) {
        toast.error(`${product.title} already in cart!`, { icon: '⚠️' });
    } else {
        // আগের কার্ট ডাটা [...cart] রেখে নতুনটা যোগ করা
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        
        // কার্ট রিফ্রেশ করার জন্য ইভেন্ট
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!");
    }
};

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9]/g, "");
    return `৳ ${Number(num).toLocaleString()}`;
  };

  return (
    <div className="px-[5%] lg:px-[12%] py-16 bg-[#fcfcfc]">
      <div className="mb-14">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-tight">
            Today&apos;s <span className="text-red-600">Best</span> <br /> Deals<span className="text-red-600">.</span>
        </h1>
      </div>
      
      {/* Top Slider Code (Same as yours) */}
      <Swiper slidesPerView={2} spaceBetween={25} loop={true} modules={[Autoplay]} autoplay={{ delay: 3500 }} speed={1200}
        breakpoints={{ 1200: { slidesPerView: 2}, 991: { slidesPerView: 2 }, 0: { slidesPerView: 1 } }}
        className='deal-swiper !pb-10'
      >
        {dealsData.map((deal, index) => (
            <SwiperSlide key={index} >
               <div className="deals-wrap px-8 py-10 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center border border-gray-100 lg:h-[280px] bg-white shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all group">
                <div className="w-full lg:w-1/2 overflow-hidden">
                    <Image src={deal.image} alt={deal.title} className='object-contain scale-110 group-hover:scale-125 transition-transform duration-700'/>
                </div>
                <div className="w-full lg:w-1/2 deal-info mt-6 lg:mt-0">
                    <h2 className='merienda font-black text-3xl leading-tight uppercase tracking-tighter text-gray-800'>{deal.title}</h2>
                    <p className='text-gray-400 font-bold text-sm mt-2'>{deal.description}</p>
                    <Link href={{ pathname: '/UI-Components/Shop', query: { category: deal.category } }}>
                        <button className="px-8 py-3 rounded-full text-white font-black mt-6 bg-red-600 hover:bg-black transition-all cursor-pointer">Shop Now</button>
                    </Link>
                </div>
               </div>
            </SwiperSlide>
        ))}
      </Swiper>

      {/* Database Product List (৫টি প্রোডাক্ট) */}
      <div className="mt-16">
        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[2rem]"></div>)}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {products.map((product) => {
                    const uniqueKey = String(product._id);
                    return (
                        <div key={uniqueKey} className="group border border-gray-100 rounded-[2.5rem] p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-red-100 flex flex-col relative overflow-hidden h-full">
                            <div className="relative flex items-center justify-center w-full h-52 overflow-hidden rounded-2xl bg-gray-50 mb-5">
                                <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4'/>
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all"> 
                                  <button onClick={(e) => { e.preventDefault(); handleAddToCart(product); }} className='w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full shadow-xl hover:bg-black cursor-pointer'><i className='bi bi-cart-plus text-2xl'></i></button>
                                </div>
                            </div>
                            <Link href={`/UI-Components/Shop?id=${uniqueKey}`} className="flex-grow flex flex-col">
                                <h2 className="text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors mb-3 h-10 uppercase leading-tight tracking-tight">{product.title}</h2>
                                <div className='mt-auto pt-4 border-t border-gray-50 flex items-end justify-between'>
                                    <div className="flex flex-col">
                                        {product.lessPrice && <span className="text-gray-400 text-[11px] line-through font-bold">{formatPrice(product.lessPrice)}</span>}
                                        <span className="text-2xl font-black text-red-600 tracking-tighter">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-red-50"><i className="bi bi-arrow-right-short text-gray-400 group-hover:text-red-600 text-xl"></i></div>
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