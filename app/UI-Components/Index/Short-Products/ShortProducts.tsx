'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Swiper Imports
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// লোকাল ডাটা ইমপোর্ট
import localData from '@/app/JsonData/ShortProducts.json'; 

// টাইপ ইন্টারফেস
interface Product {
    _id?: string;
    Id?: string | number;
    image: string;
    title: string;
    price: string | number;
    lessPrice?: string | number;
    review?: string;
    section?: string;
    createdAt?: string;
}

interface LocalDataStructure {
    Featured: Product[];
    TopSelling: Product[];
    OnSale: Product[];
    TopRated: Product[];
}

// =========================================================
// ১. কলাম কম্পোনেন্ট (Reusable)
// =========================================================
const ProductColumn = ({ title, products, delay }: { title: string, products: Product[], delay: number }) => {
    
    // স্লাইডার স্মুথ করার জন্য ডাটা প্রসেসিং
    const chunkedProducts = useMemo(() => {
        if (products.length === 0) return [];

        // যদি আইটেম ৫টির কম হয়, তবে স্লাইড করার জন্য সেটিকে ডুপ্লিকেট করা হবে
        let processedProducts = [...products];
        if (processedProducts.length > 0 && processedProducts.length <= 5) {
            processedProducts = [...processedProducts, ...processedProducts];
        }

        const chunks = [];
        for (let i = 0; i < processedProducts.length; i += 5) {
            chunks.push(processedProducts.slice(i, i + 5));
        }
        return chunks;
    }, [products]);

    const formatPrice = (p: string | number) => {
        const num = String(p).replace(/[^0-9.]/g, "");
        return `৳${Number(num).toLocaleString()}`;
    };

    if (products.length === 0) return null;

    return (
        <div className="flex flex-col rounded-[2rem] gap-2 p-5 border border-gray-100 hover:border-red-600 transition-all duration-500 bg-white shadow-sm hover:shadow-2xl h-full group">
            
            <div className="short-product-title py-3 px-5 rounded-2xl bg-gray-50 mb-4 border-l-4 border-red-600">
                <h2 className='unbounded text-[11px] font-black uppercase tracking-widest text-gray-800'>
                    {title}
                </h2>
            </div>

            <div className="w-full flex-1">
                <Swiper
                    slidesPerView={1}  
                    loop={chunkedProducts.length > 1}        
                    speed={1200}       
                    autoplay={{ 
                        delay: delay, // Math.random() এর বদলে প্রোড দিয়ে পাঠানো ফিক্সড ডিলে
                        disableOnInteraction: false 
                    }}
                    modules={[Autoplay]}
                    className='h-auto'
                >
                    {chunkedProducts.map((group, groupIndex) => (
                        <SwiperSlide key={groupIndex}>
                            <div className="flex flex-col gap-1"> 
                                {group.map((item, idx) => {
                                    const uniqueID = String(item._id || item.Id || `item-${groupIndex}-${idx}`);
                                    return (
                                        <Link 
                                            key={uniqueID}
                                            href={`/UI-Components/Shop?id=${uniqueID}`}
                                        >
                                            <div className="short-product w-full flex items-center gap-4 p-3 border-b border-gray-50 hover:bg-red-50/50 transition-all rounded-2xl cursor-pointer group/item">
                                                <div className="w-16 h-16 relative border border-gray-100 rounded-xl bg-white flex-shrink-0 overflow-hidden p-1 shadow-sm group-hover/item:scale-105 transition-transform">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.title} 
                                                        className='w-full h-full object-contain' 
                                                    />
                                                </div>
                                                
                                                <div className="flex-1 overflow-hidden">
                                                    <h2 className='text-[11px] font-bold text-gray-800 line-clamp-1 uppercase tracking-tight group-hover/item:text-red-600 transition-colors'>
                                                        {item.title}
                                                    </h2>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className='font-black text-red-600 text-sm tracking-tighter'>
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        {item.lessPrice && (
                                                            <del className='text-gray-400 text-[9px] font-bold'>
                                                                {formatPrice(item.lessPrice)}
                                                            </del>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] text-yellow-500 font-black mt-1">
                                                        <i className='bi bi-star-fill'></i>
                                                        <span className="text-gray-400 uppercase tracking-widest">{item.review || "(4.8)"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

// =========================================================
// ২. মেইন কম্পোনেন্ট (ShortProducts)
// =========================================================
const ShortProducts = () => {
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setDbProducts(data);
                }
            } catch (error) {
                console.error("Database error, showing JSON only.");
            }
        };

        fetchProducts();
        return () => clearTimeout(timer);
    }, []);

    const sections = useMemo(() => {
        const json = localData as LocalDataStructure;
        const fromDB = (secName: string) => dbProducts.filter(p => p.section === secName);

        return {
            featured: [...fromDB("Featured"), ...(json.Featured || [])],
            topSelling: [...fromDB("TopSelling"), ...(json.TopSelling || [])],
            onSale: [...fromDB("OnSale"), ...fromDB("BestDeals"), ...(json.OnSale || [])],
            topRated: [...fromDB("TopRated"), ...fromDB("HotDeals"), ...(json.TopRated || [])],
        };
    }, [dbProducts]);

    if (!mounted) return null;

    return (
        <div className="px-[5%] lg:px-[12%] py-16 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* প্রত্যেক কলামে আলাদা ফিক্সড ডিলে পাঠানো হয়েছে (Impure Function Fix) */}
                <ProductColumn title="Featured Items" products={sections.featured} delay={3000} />
                <ProductColumn title="Top Selling" products={sections.topSelling} delay={3500} />
                <ProductColumn title="On-Sale Deals" products={sections.onSale} delay={4000} />
                <ProductColumn title="Top Rated" products={sections.topRated} delay={4500} />

            </div>
        </div>
    );
};

export default ShortProducts;