'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaApple, FaTicketAlt } from 'react-icons/fa'

import phone from '@/public/images/phone.png'

const Banner = () => {
  return (
    <div className='px-[5%] lg:px-[12%] py-12 bg-white'>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-black group flex items-center shadow-2xl border border-gray-900">
            
            {/* ব্যাকগ্রাউন্ড ডেকোরেশন (লাল গ্লো) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full -mr-32 -mt-32 blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-600 rounded-full -ml-20 -mb-20 blur-[80px] opacity-20"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full px-8 lg:px-16 gap-8">
                
                {/* টেক্সট কন্টেন্ট - এখানে উপর-নিচে প্যাডিং (py-12 lg:py-20) বাড়ানো হয়েছে */}
                <div className="flex flex-col items-start text-center lg:text-left w-full lg:w-3/5 py-12 lg:py-14">
                    
                    <div className="flex items-center gap-2 mb-6 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 mx-auto lg:mx-0">
                        <FaApple className="text-white text-lg" />
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Exclusive Offer</span>
                    </div>

                    <h1 className="unbounded text-white text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tighter uppercase mb-6">
                        Get <span className="text-red-600">৳ 5,000</span> OFF <br className="hidden lg:block" /> 
                        on select <span className="text-red-600">Apple</span> products
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mb-8 justify-center lg:justify-start">
                        <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg shadow-red-900/40 animate-pulse">
                            <FaTicketAlt /> Use Code: ENTGADGET@10
                        </div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            *Valid once per user. Min spend ৳ 25,000
                        </p>
                    </div>

                    <Link href="/UI-Components/Shop">
                        <button className="px-10 py-4 rounded-full text-black font-black bg-white hover:bg-red-600 hover:text-white transition-all duration-500 cursor-pointer flex items-center gap-3 shadow-xl uppercase text-xs tracking-widest active:scale-95 group/btn">
                            Claim Discount <i className="bi bi-arrow-right-short text-xl group-hover/btn:translate-x-1 transition-transform"></i>
                        </button>
                    </Link>
                </div>

                {/* ইমেজ এরিয়া */}
                <div className="relative w-full lg:w-1/3 flex justify-center items-center lg:justify-end pb-10 lg:pb-0">
                    <div className="relative w-[260px] h-[260px] lg:w-[320px] lg:h-[320px] group-hover:scale-105 transition-transform duration-1000 ease-out">
                        <Image 
                            src={phone} 
                            alt='Apple Gadgets' 
                            fill
                            className='object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)]'
                        />
                    </div>
                </div>
            </div>
            
            {/* কিনারায় ছোট ডিজাইন এলিমেন্ট */}
            <div className="absolute top-1/2 right-[5%] w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>
    </div>
  )
}

export default Banner;