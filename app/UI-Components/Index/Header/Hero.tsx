'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Autoplay, Navigation } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface SliderData {
  _id: string; image: string; badge: string;
  titleStart: string; titleHighlight: string; titleEnd: string;
  description: string;
  buttonText: string; link: string;
  secondaryBtnText?: string; secondaryBtnLink?: string;
}

const Hero = () => {
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch('/api/sliders');
        if (res.ok) {
            const data = await res.json();
            setSliders(data);
        }
      } catch (error) { console.error('Failed to fetch sliders', error); } 
      finally { setLoading(false); }
    };
    fetchSliders();
  },[]);

  if (loading) {
    return (
        <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className='px-[5%] md:px-[8%] lg:px-[12%] py-6 bg-white'> 
        <div className='relative Hero w-full group'>
            {sliders.length > 0 ? (
                <Swiper 
                    slidesPerView={1} loop={true} effect='fade' fadeEffect={{crossFade: true}}
                    modules={[EffectFade, Pagination, Autoplay, Navigation]} 
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    className='hero-swiper w-full rounded-[2rem] overflow-hidden shadow-2xl' 
                >
                    {sliders.map((slide) => (
                        <SwiperSlide key={slide._id}>
                            {/* CHANGED: Adjusted lg:min-h to 480px and xl:min-h to 600px for 13" laptops */}
                            <div className="hero-wrap relative w-full min-h-[400px] md:min-h-[450px] lg:min-h-[480px] xl:min-h-[600px] flex items-center bg-cover bg-center" style={{ backgroundImage: `url('${slide.image}')` }}> 
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 lg:via-white/90 to-transparent"></div>
                                
                                <div className="relative w-full md:w-4/5 lg:w-3/5 p-8 md:p-12 xl:p-16 z-10">
                                    <span className="inline-block bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] mb-4 md:mb-6 animate-pulse border border-red-200">
                                        {slide.badge}
                                    </span>
                                    
                                    {/* CHANGED: Adjusted Text sizes so it doesn't break on 13" laptop (lg:text-5xl) */}
                                    <h1 className="unbounded text-3xl md:text-5xl lg:text-5xl xl:text-[4.2rem] font-black leading-tight text-black tracking-tighter mb-4">
                                        {slide.titleStart} <br className="hidden md:block" />  
                                        <span className="text-red-600">{slide.titleHighlight}</span> {slide.titleEnd}
                                    </h1>
                                    
                                    <p className="max-w-md text-gray-500 font-bold text-xs md:text-sm lg:text-base mb-6 md:mb-8 leading-relaxed line-clamp-3">
                                        {slide.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                        <Link href={slide.link}>
                                            <button className="px-6 py-3 lg:px-10 lg:py-4 rounded-xl text-white font-black bg-red-600 hover:bg-black transition-all duration-500 cursor-pointer shadow-xl shadow-red-200 uppercase text-[10px] lg:text-xs tracking-widest active:scale-95">
                                                {slide.buttonText} <i className="bi bi-arrow-right ml-2"></i>
                                            </button>
                                        </Link>
                                        
                                        {slide.secondaryBtnText && slide.secondaryBtnLink && (
                                            <Link href={slide.secondaryBtnLink}>
                                                <button className="px-6 py-3 lg:px-8 lg:py-4 rounded-xl text-gray-600 hover:text-white font-black bg-white hover:bg-black border-2 border-gray-100 hover:border-black transition-all duration-500 cursor-pointer uppercase text-[10px] lg:text-xs tracking-widest active:scale-95 shadow-sm">
                                                    {slide.secondaryBtnText}
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="w-full h-[400px] bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                    <i className="bi bi-images text-4xl text-gray-300 mb-2"></i>
                    <p className="text-gray-400 font-bold text-sm">No banners active. Upload from Admin Panel.</p>
                </div>
            )}

            <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer text-black hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-100"><i className="bi bi-chevron-left text-lg"></i></div>
            <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer text-black hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-100"><i className="bi bi-chevron-right text-lg"></i></div>
        </div>
    </div>
  )
}

export default Hero;