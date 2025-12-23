'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Autoplay, Navigation } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Hero = () => {
  return (
    <div className='px-[5%] md:px-[8%] lg:px-[12%] py-6 bg-white'> 
        <div className='relative Hero w-full group'>
            <Swiper 
                slidesPerView={1} 
                loop={true}
                effect='fade'
                fadeEffect={{crossFade: true}}
                modules={[EffectFade, Pagination, Autoplay, Navigation]} 
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                className='hero-swiper w-full rounded-[2rem] overflow-hidden shadow-2xl' 
            >
                {/* === Slide 1: Headphone === */}
                <SwiperSlide>
                    <div className="hero-wrap relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center bg-[url('/images/banner1.png')] bg-cover bg-center"> 
                        {/* Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                        
                        <div className="relative w-full lg:w-3/5 p-8 md:p-16 z-10">
                            <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 animate-pulse">
                                Premium Audio
                            </span>
                            <h1 className="unbounded text-4xl md:text-6xl lg:text-[4.2rem] font-black leading-[1.1] text-black tracking-tighter mb-6">
                                HAYLOU S40 <br />  
                                <span className="text-red-600">Wireless</span> Pro.
                            </h1>
                            <p className="max-w-md text-gray-500 font-bold text-base md:text-lg mb-8 leading-relaxed">
                                Experience Hybrid Active Noise Cancellation with 60 hours of playtime. Pure sound, zero noise.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href='/UI-Components/Shop'>
                                    <button className="px-10 py-4 rounded-xl text-white font-black bg-red-600 hover:bg-black transition-all duration-500 cursor-pointer shadow-xl shadow-red-200 uppercase text-xs tracking-widest active:scale-95">
                                        Shop Now <i className="bi bi-arrow-right ml-2"></i>
                                    </button>
                                </Link>
                                <button className="px-10 py-4 rounded-xl text-black font-black bg-white border-2 border-gray-100 hover:border-red-600 transition-all duration-500 cursor-pointer uppercase text-xs tracking-widest">
                                    View Specs
                                </button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                 {/* === Slide 2: Smartwatch === */}
                <SwiperSlide>
                    <div className="hero-wrap relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center bg-[url('/images/banner2.png')] bg-cover bg-center"> 
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                        <div className="relative w-full lg:w-3/5 p-8 md:p-16 z-10">
                            <span className="inline-block bg-black text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                                New Arrival
                            </span>
                            <h1 className="unbounded text-4xl md:text-6xl lg:text-[4.2rem] font-black leading-[1.1] text-black tracking-tighter mb-6">
                                HAYLOU S6 <br />  
                                <span className="text-red-600">Smart</span> Vision.
                            </h1>
                            <p className="max-w-md text-gray-500 font-bold text-base md:text-lg mb-8 leading-relaxed">
                                2.01&quot; Large TFT Display with Bluetooth Calling and IP68 Water Resistance. Elevate your lifestyle.
                            </p>
                            <Link href='/UI-Components/Shop'>
                                <button className="px-10 py-4 rounded-xl text-white font-black bg-black hover:bg-red-600 transition-all duration-500 cursor-pointer shadow-xl shadow-gray-300 uppercase text-xs tracking-widest active:scale-95">
                                    Pre-Order Now <i className="bi bi-lightning-charge-fill ml-2"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>

                 {/* === Slide 3: Power Bank === */}
                <SwiperSlide>
                    <div className="hero-wrap relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center bg-[url('/images/banner3.png')] bg-cover bg-center"> 
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                        <div className="relative w-full lg:w-3/5 p-8 md:p-16 z-10">
                            <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                                Best Seller
                            </span>
                            <h1 className="unbounded text-4xl md:text-6xl lg:text-[4.2rem] font-black leading-[1.1] text-black tracking-tighter mb-6">
                                FONENG 65W <br />  
                                <span className="text-red-600">Ultra</span> Fast.
                            </h1>
                            <p className="max-w-md text-gray-500 font-bold text-base md:text-lg mb-8 leading-relaxed">
                                20000mAh Power Bank with Color Display. Charge your Laptop, Tablet, and Phone simultaneously.
                            </p>
                            <Link href='/UI-Components/Shop'>
                                <button className="px-10 py-4 rounded-xl text-white font-black bg-red-600 hover:bg-black transition-all duration-500 cursor-pointer shadow-xl shadow-red-200 uppercase text-xs tracking-widest active:scale-95">
                                    Buy Now <i className="bi bi-cart-check ml-2"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            {/* Custom Navigation Buttons (Visible on Hover) */}
            <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer text-black hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                <i className="bi bi-chevron-left text-xl"></i>
            </div>
            <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer text-black hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                <i className="bi bi-chevron-right text-xl"></i>
            </div>
        </div>
    </div>
  )
}

export default Hero;