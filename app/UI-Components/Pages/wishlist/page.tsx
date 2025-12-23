'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getStorageKey } from '@/app/utiles/storageHelper'; 
import { FaTrash, FaCartPlus, FaHeartBroken, FaArrowRight } from 'react-icons/fa';

// টাইপ ইন্টারফেস
interface Product {
    _id?: string;
    Id?: string | number;
    title: string;
    price: string | number;
    image: string;
    qty?: number;
    [key: string]: unknown;
}

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);

    // ১. আইডি পাওয়ার নিরাপদ লজিক
    const getSafeId = useCallback((item: Product) => String(item._id || item.Id || ""), []);

    // ২. ডাটা লোড ফাংশন (Optimized with useCallback)
    const loadWishlist = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const wishlistKey = getStorageKey('wishlist'); 
            const storedData = localStorage.getItem(wishlistKey);
            const items = storedData ? JSON.parse(storedData) : [];
            setWishlistItems(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Wishlist Load Error:", error);
            setWishlistItems([]);
        }
    }, []);

    // ৩. মাউন্ট এবং ইভেন্ট লিসেনার (ERROR FIXED HERE)
    useEffect(() => {
        // ফিক্স: সরাসরি সেট না করে একটি ছোট ডিলে বা নেক্সট টিকে সেট করা হচ্ছে
        const timer = setTimeout(() => {
            setMounted(true);
            loadWishlist(); // মাউন্ট হওয়ার পর ডাটা লোড হবে
        }, 0);

        window.addEventListener('storageUpdate', loadWishlist);
        window.addEventListener('authUpdate', loadWishlist); 
        window.addEventListener('storage', loadWishlist); 
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('storageUpdate', loadWishlist);
            window.removeEventListener('authUpdate', loadWishlist);
            window.removeEventListener('storage', loadWishlist);
        };
    }, [loadWishlist]);

    // ৪. রিমুভ ফাংশন
    const handleRemove = (product: Product) => {
        const idToRemove = getSafeId(product);
        const wishlistKey = getStorageKey('wishlist');
        const updated = wishlistItems.filter((item) => getSafeId(item) !== idToRemove);
        
        localStorage.setItem(wishlistKey, JSON.stringify(updated));
        setWishlistItems(updated);
        window.dispatchEvent(new Event('storageUpdate'));
        toast.error('Removed from wishlist');
    };

    // ৫. কার্টে মুভ করার ফাংশন
    const handleMoveToCart = (product: Product) => {
        const cartKey = getStorageKey('cart');
        const storedCart = localStorage.getItem(cartKey);
        const cart: Product[] = storedCart ? JSON.parse(storedCart) : [];
        
        const currentId = getSafeId(product);
        const isExist = cart.some((item) => getSafeId(item) === currentId);

        if (isExist) {
            toast('Already in your cart!', { icon: '⚠️' });
        } else {
            const updatedCart = [...cart, { ...product, qty: 1 }];
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            
            // উইশলিস্ট থেকে ডিলিট
            handleRemove(product);
            toast.success('Moved to cart!');
        }
    };

    // মাউন্ট না হওয়া পর্যন্ত কিছুই রেন্ডার হবে না (Hydration Fix)
    if (!mounted) return null;

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen text-gray-800">
            {/* হেডার সেকশন */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-black p-8 rounded-[2rem] shadow-xl border-l-8 border-red-600">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter unbounded">
                        My Wishlist
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
                    </p>
                </div>
                <Link href="/UI-Components/Shop" className="mt-4 md:mt-0 px-6 py-2 bg-white/10 hover:bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                    Continue Shopping
                </Link>
            </div>

            {wishlistItems.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-28 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                    <FaHeartBroken className="text-7xl text-gray-100 mb-6" />
                    <h2 className="text-xl font-black text-gray-300 uppercase tracking-widest">Empty Wishlist</h2>
                    <Link href="/UI-Components/Shop" className="mt-8 px-10 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg text-xs uppercase tracking-widest">
                        Explore Shop
                    </Link>
                </div>
            ) : (
                /* Item List Area */
                <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-400 border-b">
                        <div className="col-span-6">Product Details</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {wishlistItems.map((item, index) => {
                            const currentID = getSafeId(item);
                            const priceClean = String(item.price).replace(/[^0-9.]/g, "");

                            return (
                                <div key={currentID || index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50/50 transition-all duration-300">
                                    <div className="col-span-12 md:col-span-6 flex items-center gap-5">
                                        <div className="w-20 h-20 relative flex-shrink-0 border border-gray-100 rounded-2xl bg-white overflow-hidden p-2 flex items-center justify-center">
                                            <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/UI-Components/Shop?id=${currentID}`}>
                                                <h3 className="font-bold text-gray-800 text-sm line-clamp-1 uppercase tracking-tighter hover:text-red-600 transition-colors cursor-pointer">{item.title}</h3>
                                            </Link>
                                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">In Stock</span>
                                        </div>
                                    </div>

                                    <div className="col-span-6 md:col-span-2 text-left md:text-center">
                                        <span className="font-black text-gray-800 text-lg tracking-tighter">
                                            ৳{Number(priceClean).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="hidden md:block col-span-2 text-center">
                                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                            Premium
                                        </span>
                                    </div>

                                    <div className="col-span-6 md:col-span-2 flex justify-end gap-3">
                                        <button 
                                            onClick={() => handleMoveToCart(item)}
                                            className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-90 cursor-pointer"
                                        >
                                            <FaCartPlus size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleRemove(item)}
                                            className="w-11 h-11 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;