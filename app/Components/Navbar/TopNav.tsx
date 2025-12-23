'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useMemo, useCallback } from 'react';

// ১. টাইপ ইন্টারফেস
interface User {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    name?: string;
    email?: string;
    image?: string | null;
}

const TopNav = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  const displayName = useMemo(() => {
    if (!user) return "User";
    return user.fullName || user.name || user.firstName || "User";
  }, [user]);

  const firstLetter = useMemo(() => {
    return displayName ? displayName.charAt(0).toUpperCase() : "U";
  }, [displayName]);

  const checkUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    } catch (error: unknown) {
        console.error("Error parsing user data:", error);
        setUser(null);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setMounted(true);
        checkUser();
    }, 0);

    window.addEventListener('authUpdate', checkUser);
    window.addEventListener('storage', checkUser); 

    return () => {
        clearTimeout(timer);
        window.removeEventListener('authUpdate', checkUser);
        window.removeEventListener('storage', checkUser);
    };
  }, [checkUser]);

  if (!mounted) return null;

  return (
    // ব্যাকগ্রাউন্ড সাদা (Middle/Bottom এর সাথে মিল রেখে) এবং বর্ডার গ্রে
    <div className='w-full bg-white text-gray-600 text-[11px] md:text-xs border-b border-gray-100'>
        <div className='flex items-center justify-between py-2.5 px-[5%] lg:px-[12%] flex-col md:flex-row gap-2'>
            
            {/* Left Side Links */}
            <div className="flex items-center justify-center md:justify-start gap-4">
                <Link href='/UI-Components/Pages/About' className='hover:text-red-600 transition-colors font-medium'>About Us</Link>
                <div className="w-[1px] h-3 bg-gray-200"></div>
                <Link href='/UI-Components/Pages/FreeDelivery' className='hover:text-red-600 transition-colors font-medium'>Free Delivery</Link>
                <div className="w-[1px] h-3 bg-gray-200"></div>
                <Link href='/UI-Components/Pages/ReturnPolicy' className='hover:text-red-600 transition-colors font-medium'>Returns Policy</Link>
            </div>

            {/* Right Side Links */}
            <div className="flex items-center space-x-4 justify-center md:justify-end">
               
               <Link href='/UI-Components/Pages/contact' className='hover:text-red-600 transition-colors font-medium'>Contact Us</Link>
               <div className="w-[1px] h-3 bg-gray-200"></div>
               <Link href='/UI-Components/Pages/HelpCenter' className='hover:text-red-600 transition-colors font-medium'>Help Center</Link>
               
               <div className="w-[1px] h-3 bg-gray-200"></div>

               {user ? (
                   // লগইন থাকলে ক্যাপসুল ডিজাইন (লাল এবং কালো থিম)
                   <Link href='/UI-Components/Pages/account' className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full transition-all border border-gray-200 group'>
                       <div className="relative w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-red-600 text-white shadow-sm">
                           {user.image ? (
                               <Image 
                                   src={user.image} 
                                   alt="Profile" 
                                   fill 
                                   className="object-cover"
                                   unoptimized
                               />
                           ) : (
                               <span className="font-black text-[9px] uppercase">{firstLetter}</span>
                           )}
                       </div>
                       <span className='font-bold text-gray-800 tracking-tight capitalize group-hover:text-red-600 transition-colors'>
                           {displayName.split(" ")[0]}
                       </span>
                   </Link>
               ) : (
                   // লগআউট থাকলে সাইন ইন বাটন
                   <Link href='/UI-Components/Pages/account' className='flex items-center gap-1.5 hover:text-red-600 font-bold transition-all text-gray-700'>
                       <i className="bi bi-person-circle text-sm"></i>
                       <span>Sign In</span>
                   </Link>
               )}
            </div>
        </div>
    </div>
  )
}

export default TopNav;