'use client';

import React from 'react'
import { FaTruck, FaUndoAlt, FaHeadset, FaShieldAlt } from 'react-icons/fa';

const Benefits = () => {
  const benefitData = [
    {
        icon: <FaTruck />,
        title: "Fast Delivery",
        desc: "Inside Dhaka in 24-48h",
        charge: "Starting from ৳100"
    },
    {
        icon: <FaUndoAlt />,
        title: "7 Days Return",
        desc: "Easy return policy",
        charge: "Manufacturing defects"
    },
    {
        icon: <FaHeadset />,
        title: "Expert Support",
        desc: "Friendly 24/7 support",
        charge: "Call: 01670424702"
    },
    {
        icon: <FaShieldAlt />,
        title: "Secure Payment",
        desc: "100% safe transaction",
        charge: "bKash, Cards, COD"
    }
  ];

  return (
    <div className="px-[5%] lg:px-[12%] py-16 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitData.map((benefit, index) => (
                <div 
                    key={index} 
                    className="group flex flex-col items-center text-center p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:border-red-600 hover:shadow-2xl hover:shadow-red-100 transition-all duration-500 cursor-default relative overflow-hidden"
                >
                    {/* ব্যাকগ্রাউন্ড ডেকোরেশন (Hover এ দেখা যাবে) */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                    {/* আইকন সেকশন */}
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl group-hover:bg-red-600 group-hover:scale-110 transition-all duration-500 shadow-gray-200 group-hover:shadow-red-200">
                        {benefit.icon}
                    </div>

                    {/* টেক্সট কন্টেন্ট */}
                    <div className="relative z-10">
                        <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900 mb-2 unbounded">
                            {benefit.title}
                        </h2>
                        <p className="text-gray-500 text-xs font-bold leading-relaxed">
                            {benefit.desc}
                        </p>
                        <p className="text-red-600 text-[10px] font-black uppercase mt-3 tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            {benefit.charge}
                        </p>
                    </div>

                    {/* নিচে ছোট লাল বার */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-red-600 group-hover:w-1/3 transition-all duration-500 rounded-full"></div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Benefits;