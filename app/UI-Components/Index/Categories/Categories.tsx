'use client';

import React from 'react'
import 'swiper/swiper.css'
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import Category1 from '@/public/images/category1.jpg'
import Category2 from '@/public/images/category2.jpg'
import Category3 from '@/public/images/category3.jpg'
import Category4 from '@/public/images/category4.webp'
import Category5 from '@/public/images/category5.webp'
import Category6 from '@/public/images/category6.webp'
import Category7 from '@/public/images/category7.jpg'
import Category8 from '@/public/images/category8.webp'

type CategoryType = {
    image: StaticImageData;
    title: string;
    products: string; 
    value: string;
}

const categories: CategoryType[] = [
    {image: Category1, title:'Mobile', products: '125+ Products', value: 'Mobile Phone' },
    {image: Category2, title:'Tablet', products: '90+ Products', value: 'Tablet PC' },
    {image: Category3, title:'Laptops', products: '80+ Products', value: 'Laptop' }, 
    {image: Category4, title:'Televisions', products: '100+ Products', value: 'TV' },
    {image: Category5, title:'Computer & Gaming', products: '60+ Products', value: 'Gaming Console' },
    {image: Category6, title:'Accessories', products: '150+ Products', value: 'Mobile Accessories' },
    {image: Category7, title:'Earbuds', products: '70+ Products', value: 'Earbuds' },
    {image: Category8, title:'Smart Watch', products: '110+ Products', value: 'Smart Watch' }
]

const Categories = () => {
  return (
    <div className='px-[5%] lg:px-[12%] py-16 bg-white'>
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
                0 : {slidesPerView: 2}, // মোবাইলে ২টা করে দেখালে সুন্দর লাগে
            }}
            className='ctg-swiper !pb-10'
        >
            {categories.map((category, index )=> (
                <SwiperSlide key={index}>
                    <Link 
                        href={{
                            pathname: '/UI-Components/Shop',
                            query: { category: category.value }
                        }}
                        className="group block"
                    >
                        <div className="category-wrap flex flex-col justify-center items-center cursor-pointer bg-gray-50 border border-gray-100 p-6 h-[260px] rounded-[2.5rem] group-hover:bg-white group-hover:border-red-600 group-hover:shadow-2xl group-hover:shadow-red-100 transition-all duration-500 relative overflow-hidden">
                            
                            {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                            <div className="category-image w-full h-[120px] flex items-center justify-center relative z-10">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    className='transition-transform duration-700 group-hover:scale-110 h-full object-contain mix-blend-multiply'
                                />
                            </div>

                            <div className="category-info mt-6 text-center relative z-10">
                                <h2 className='text-sm font-black uppercase tracking-tight text-gray-800 group-hover:text-red-600 transition-colors duration-300 unbounded'>
                                    {category.title}
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                    {category.products}
                                </p>
                            </div>

                            {/* নিচে ছোট লাল ইন্ডিকেটর */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-red-600 group-hover:w-1/3 transition-all duration-500"></div>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
  )
}

export default Categories;