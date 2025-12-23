'use client';

import React from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

import promotionalBanner1 from '@/public/images/promotional-banner-img1.jpg'
import promotionalBanner2 from '@/public/images/promotional-banner-img2.jpg'
import promotionalBanner3 from '@/public/images/promotional-banner-img3.jpg'

type BannerType = {
    image: StaticImageData;
    heading: string;
    subHeading: string; // নতুন ফিল্ড যোগ করা হয়েছে
    category: string;
}

const banners: BannerType[] = [
    { 
      image: promotionalBanner1, 
      heading: 'Pure Bass Audio', 
      subHeading: 'Premium Bluetooth Speakers',
      category: 'Bluetooth Speakers' 
    },
    { 
      image: promotionalBanner2, 
      heading: 'Noise Cancel', 
      subHeading: 'Studio Quality Headphones',
      category: 'Headphone' 
    },
    { 
      image: promotionalBanner3, 
      heading: 'Smart Tech', 
      subHeading: 'Latest Tablets & Mobiles',
      category: 'Mobile Phone' 
    },
]

const Banners = () => {
  return (
    <div className='px-[5%] lg:px-[12%] py-16 bg-white'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {banners.map((banner, index ) => (
                <div key={index} className="relative h-[320px] rounded-[2.5rem] overflow-hidden group border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700">
                    
                    {/* ব্যাকগ্রাউন্ড ইমেজ এনিমেশন */}
                    <Image 
                        src={banner.image} 
                        alt={banner.heading} 
                        className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                        placeholder="blur"
                    />

                    {/* প্রিমিয়াম গ্রেডিয়েন্ট ওভারলে */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
                    
                    {/* কন্টেন্ট এরিয়া */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end items-start z-10">
                        
                        {/* ছোট ব্যাজ */}
                        <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            Limited Deal
                        </span>

                        <h2 className='text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white leading-none mb-1 unbounded'>
                            {banner.heading}
                        </h2>
                        
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-6 opacity-80">
                            {banner.subHeading}
                        </p>
                        
                        <Link 
                            href={{
                                pathname: '/UI-Components/Shop',
                                query: { category: banner.category }
                            }}
                        >
                            <button className="px-6 py-3 rounded-full text-white font-black bg-red-600 hover:bg-white hover:text-black transition-all duration-500 cursor-pointer flex items-center gap-2 shadow-xl shadow-red-900/20 text-[10px] uppercase tracking-widest active:scale-95 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-delay-200">
                                Explore Now <i className="bi bi-arrow-right-short text-lg"></i>
                            </button>
                        </Link>
                    </div>

                    {/* কিনারায় ছোট ডিজাইন এলিমেন্ট */}
                    <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:border-red-600 transition-colors">
                        <i className="bi bi-plus-lg text-white group-hover:text-red-600 transition-colors"></i>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Banners;