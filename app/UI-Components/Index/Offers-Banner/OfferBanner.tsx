'use client'

import React from 'react'
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import offer1 from '@/public/images/offer-img1.jpg';
import offer2 from '@/public/images/offer-img2.jpg';

type OfferItem = {
    image: StaticImageData;
    title: string;
    ctg: string; 
    category: string; 
    classname?: string;
}

const OfferData: OfferItem[] = [
    {
        image: offer1, 
        title: 'UP TO 30% OFF \n ON HEADPHONES', 
        ctg: 'Limited Offer', 
        category: 'Headphone'
    },
    {
        image: offer2, 
        title: 'DUALSENSE WIRELESS \n CONTROLLER', 
        ctg: 'Gaming Zone', 
        category: 'Gaming Console'
    },
];

const OfferBanner = () => {
  return (
    <div className="px-[5%] lg:px-[12%] mb-16 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
            {OfferData.map((offer, index) => (
                <div key={index} className="group relative w-full h-[340px] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700">
                    
                    {/* ব্যাকগ্রাউন্ড ইমেজ জুম এনিমেশন */}
                    <Image 
                        src={offer.image} 
                        alt={offer.title} 
                        fill 
                        className='object-cover object-center transition-transform duration-1000 group-hover:scale-110' 
                        priority
                    />
                    
                    {/* ডার্ক গ্রেডিয়েন্ট ওভারলে */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent transition-all duration-500"></div>

                    {/* কন্টেন্ট এরিয়া */}
                    <div className="absolute inset-0 z-10 p-10 flex flex-col justify-center items-start">
                        {/* ক্যাটাগরি ব্যাজ */}
                        <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 shadow-lg shadow-red-900/20">
                            {offer.ctg}
                        </span>

                        {/* টাইটেল */}
                        <h2 className="unbounded font-black text-white text-3xl md:text-4xl leading-[1.1] whitespace-pre-line mb-8 tracking-tighter uppercase">
                            {offer.title}
                        </h2>
                        
                        {/* শপ বাটন */}
                        <Link 
                            href={{
                                pathname: '/UI-Components/Shop',
                                query: { category: offer.category }
                            }}
                        >
                            <button className="flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-black bg-white/10 backdrop-blur-md border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all duration-500 cursor-pointer uppercase text-[10px] tracking-widest active:scale-95 group/btn shadow-xl">
                                Shop Now 
                                <i className="bi bi-arrow-right text-lg group-hover/btn:translate-x-1 transition-transform"></i>
                            </button>
                        </Link>
                    </div>

                    {/* === প্লাস সার্কেল (মাউস নিলে লাল হবে) === */}
                    <div className="absolute top-8 right-8 w-14 h-14 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:border-red-600 group-hover:bg-red-600/10 transition-all duration-500">
                        <i className="bi bi-plus-lg text-white group-hover:text-red-600 text-2xl transition-colors duration-500"></i>
                    </div>

                    {/* কোণায় ছোট এনিমেশন ডেকোরেশন */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all duration-700"></div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default OfferBanner;