'use client';

import React, { useEffect, useState } from 'react';
import 'swiper/swiper.css';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import toast from 'react-hot-toast'; // স্মার্ট এলার্টের জন্য

import Category1 from '@/public/images/category1.jpg';
import Category2 from '@/public/images/category2.jpg';
import Category3 from '@/public/images/category3.jpg';
import Category4 from '@/public/images/category4.webp';
import Category5 from '@/public/images/category5.webp';
import Category6 from '@/public/images/category6.webp';
import Category7 from '@/public/images/category7.jpg';
import Category8 from '@/public/images/category8.webp';

type CategoryType = {
    image: StaticImageData;
    title: string;
    value: string;
}

const categories: CategoryType[] =[
    {image: Category1, title:'Mobile', value: 'Mobile Phone' },
    {image: Category2, title:'Tablet', value: 'Tablet PC' },
    {image: Category3, title:'Laptops', value: 'Laptop' }, 
    {image: Category4, title:'Televisions', value: 'TV' },
    {image: Category5, title:'Computer & Gaming', value: 'Gaming Console' },
    {image: Category6, title:'Accessories', value: 'Mobile Accessories' },
    {image: Category7, title:'Earbuds', value: 'Earbuds' },
    {image: Category8, title:'Smart Watch', value: 'Smart Watch' }
];

const Categories = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // API থেকে ডাইনামিক ক্যাটাগরির সংখ্যাগুলো নিয়ে আসা
  useEffect(() => {
      const fetchCategoryCounts = async () => {
          try {
              const res = await fetch('/api/categories/count');
              if (res.ok) {
                  const data = await res.json();
                  setCounts(data);
              }
          } catch (error) {
              console.error("Failed to load counts", error);
          } finally {
              setLoading(false);
          }
      };

      fetchCategoryCounts();
  },[]);

  // যদি প্রোডাক্ট না থাকে, তবে ক্লিক করলে স্মার্ট এলার্ট দেখাবে
  const handleCategoryClick = (e: React.MouseEvent, count: number, categoryName: string) => {
      if (count === 0) {
          e.preventDefault(); // অন্য পেজে যাওয়া বন্ধ করবে
          toast.error(`${categoryName} items are coming soon! Stay tuned.`, {
              icon: '⏳',
              style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
          });
      }
  };

  return (
    <div className='relative z-20 px-[5%] lg:px-[12%] py-16 md:py-24 bg-white'>
        {/* === হেডার সেকশন === */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px] mb-2 block">
                    Browse Collections
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                    Shop by <span className="text-red-600">Category</span>.
                </h2>
            </div>
            <Link href="/UI-Components/Shop" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-all border-b-2 border-gray-100 hover:border-red-600 pb-1">
                View All categories
            </Link>
        </div>

        <Swiper
            slidesPerView={6}
            spaceBetween={25}
            loop={true}
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            speed={1200}
            breakpoints={{
                1400 : {slidesPerView: 6},
                1200 : {slidesPerView: 5},
                900 : {slidesPerView: 4},
                768 : {slidesPerView: 3},
                500 : {slidesPerView: 2},
                0 : {slidesPerView: 2}, 
            }}
            className='ctg-swiper !pb-10'
        >
            {categories.map((category, index) => {
                const productCount = counts[category.value] || 0;
                const isComingSoon = !loading && productCount === 0;
                const isPopular = productCount >= 5; // ৫টার বেশি প্রোডাক্ট থাকলে Popular ব্যাজ দেখাবে
                
                return (
                    <SwiperSlide key={index}>
                        <Link 
                            href={{ pathname: '/UI-Components/Shop', query: { category: category.value } }}
                            className="group block"
                            onClick={(e) => handleCategoryClick(e, productCount, category.title)}
                        >
                            <div className="category-wrap flex flex-col justify-center items-center cursor-pointer bg-gray-50 border border-gray-100 p-6 h-[260px] rounded-[2.5rem] group-hover:bg-white group-hover:border-red-600 group-hover:shadow-2xl group-hover:shadow-red-100 transition-all duration-500 relative overflow-hidden">
                                
                                {/* === 🔥 Popular Badge (Auto Logic) === */}
                                {isPopular && (
                                    <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-[8px] font-black uppercase px-2 py-1 rounded-full z-20 shadow-sm animate-pulse border border-red-200">
                                        🔥 Popular
                                    </div>
                                )}

                                {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                                <div className="category-image w-full h-[120px] flex items-center justify-center relative z-10">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        className='transition-transform duration-700 group-hover:scale-110 h-full object-contain mix-blend-multiply'
                                    />
                                </div>

                                <div className="category-info mt-6 text-center relative z-10 w-full">
                                    <h2 className='text-sm font-black uppercase tracking-tight text-gray-800 group-hover:text-red-600 transition-colors duration-300 unbounded'>
                                        {category.title}
                                    </h2>
                                    
                                    {/* === ডাইনামিক কাউন্ট / Coming Soon / Loading === */}
                                    <div className="h-4 mt-1 overflow-hidden flex justify-center items-center">
                                        {loading ? (
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
                                        ) : (
                                            <p className={`text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 ${isComingSoon ? 'text-red-500' : 'text-gray-400'}`}>
                                                {isComingSoon ? 'Coming Soon ⏳' : `${productCount} Product${productCount > 1 ? 's' : ''}`}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* নিচে ছোট লাল ইন্ডিকেটর */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-red-600 group-hover:w-1/3 transition-all duration-500"></div>
                            </div>
                        </Link>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    </div>
  )
}

export default Categories;