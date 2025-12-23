'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

interface Product {
  _id?: string;        
  Id?: string | number; 
  qty?: number;
}

const MiddleNav = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  const loadCounts = useCallback(() => {
    if (typeof window === 'undefined') return;
    const cartKey = getStorageKey('cart'); 
    const wishlistKey = getStorageKey('wishlist');
    const cart: Product[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const wishlist: Product[] = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    setCartCount(cart.reduce((acc, item) => acc + (item.qty || 1), 0));
    setWishlistCount(wishlist.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setMounted(true);
        loadCounts();
    }, 0);
    window.addEventListener("storageUpdate", loadCounts);
    window.addEventListener("authUpdate", loadCounts);
    window.addEventListener("storage", loadCounts); 
    return () => {
        clearTimeout(timer);
        window.removeEventListener("storageUpdate", loadCounts);
        window.removeEventListener("authUpdate", loadCounts);
        window.removeEventListener("storage", loadCounts);
    };
  }, [loadCounts]);

  if (!mounted) return null;

  return (
    <div className="w-full border-b border-gray-200 bg-white z-[1000]">
      <div className="flex items-center justify-between py-4 px-[5%] lg:px-[12%]">
        
        {/* ১. লোগো (মোবাইল ও ডেক্সটপ সব জায়গায় থাকবে) */}
        <Link href='/' className='text-2xl lg:text-3xl font-black merienda text-black tracking-tighter uppercase'>
          ENT<span className='text-red-600'>Gadget</span>
        </Link>

        {/* ২. ডেস্কটপ সার্চ বার (মোবাইলে hidden, ডেক্সটপে lg:flex) */}
        <div className="flex-1 ms-6 mx-6 max-w-xl relative hidden lg:flex items-center gap-2">
            <input
              type="text"
              placeholder='Search products...'
              className='w-full border-2 px-4 py-2 border-gray-100 outline-none rounded-s-xl focus:border-red-600 bg-gray-50 transition-all font-bold text-sm'
            />
            <button className='bg-red-600 text-white px-5 py-2.5 cursor-pointer rounded-r-xl hover:bg-black transition-all'>
              <i className='bi bi-search'></i>
            </button>
        </div>

        {/* ৩. আইকনসমূহ (এখন মোবাইলেও দেখা যাবে - flex থাকবে সবসময়) */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Link href='/UI-Components/Pages/wishlist' className='relative p-2 group'>
            <i className='bi bi-heart text-gray-700 text-xl group-hover:text-red-600 transition-colors'></i>
            {wishlistCount > 0 && (
              <span className='absolute top-0 right-0 rounded-full bg-red-600 w-4 h-4 text-[9px] font-black flex items-center justify-center text-white border border-white'>
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/UI-Components/Pages/cart" className='relative p-2 group'>
            <i className='bi bi-cart3 text-gray-700 text-xl group-hover:text-red-600 transition-colors'></i>
            {cartCount > 0 && (
              <span className='absolute top-0 right-0 rounded-full bg-black w-4 h-4 text-[9px] font-black flex items-center justify-center text-white border border-white'>
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </div>
  )
}

export default MiddleNav;