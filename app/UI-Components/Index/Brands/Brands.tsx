'use client'

import React from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/free-mode';

// Asset Imports
import Brand1 from "@/public/images/brand-1.png"
import Brand2 from "@/public/images/brand-2.jpg"
import Brand3 from "@/public/images/brand-3.jpg"
import Brand4 from "@/public/images/brand-4.png"
import Brand5 from "@/public/images/brand-5.png"
import Brand6 from "@/public/images/brand-6.png"
import Brand7 from "@/public/images/brand-7.png"

const Brands = () => {
    const brandsImg = [Brand1, Brand2, Brand3, Brand4, Brand5, Brand6, Brand7];

    return (
        <div className="px-[5%] lg:px-[12%] py-16 bg-white">
            <div className='bg-gray-50 rounded-[3rem] p-10 border border-gray-100 shadow-inner relative overflow-hidden'>
                
                {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="mb-12 text-center relative z-10">
                    <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[9px] mb-3 block">
                        Our Authorized Partners
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase unbounded text-gray-900 leading-none">
                        Shop By <span className="text-red-600">Brands</span>.
                    </h2>
                </div>

                {/* Continuous Flow Slider */}
                <div className="w-full relative z-10">
                    <Swiper
                        modules={[Autoplay, FreeMode]}
                        slidesPerView={2}
                        spaceBetween={30}
                        loop={true}
                        speed={5000} // অনবরত চলার গতি
                        allowTouchMove={false}
                        freeMode={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            1200: { slidesPerView: 6 },
                            992:  { slidesPerView: 5 },
                            768:  { slidesPerView: 4 },
                            480:  { slidesPerView: 3 },
                        }}
                        className='brands-marquee-swiper'
                    >
                        {brandsImg.map((brand, index) => (
                            <SwiperSlide key={index} className='flex justify-center items-center'>
                                <div className="group relative w-full h-[80px] lg:h-[100px] bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center p-4 hover:border-red-600 hover:shadow-xl transition-all duration-500 cursor-pointer">
                                    <Image 
                                        src={brand}
                                        alt={`Brand Partner`}
                                        width={120}
                                        height={60}
                                        className='object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500'
                                    />
                                    
                                    {/* নিচ দিয়ে একটি লাল দাগ (Hover Effect) */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-red-600 rounded-full group-hover:w-1/2 transition-all duration-500"></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div> 

                {/* অতিরিক্ত CSS যুক্ত করা হয়েছে Marquee ইফেক্ট স্মুথ করার জন্য */}
                <style jsx global>{`
                    .brands-marquee-swiper .swiper-wrapper {
                        transition-timing-function: linear !important;
                    }
                `}</style>
            </div> 
        </div>
    )
}

export default Brands;