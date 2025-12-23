'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

// === কাস্টম এনিমেশন স্টাইল ===
const customStyles = `
  @keyframes smoothSlideDown {
    0% { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-smooth-drop { animation: smoothSlideDown 0.5s ease-in-out forwards; }
`;

// ১. ইন্টারফেস ডিফাইন (any এরর দূর করতে)
interface CartItem {
  _id?: string;
  Id?: number | string;
  qty?: number;
}

type NavLink = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: 'Mobile & Computing',
    href: "#",
    dropdown: [
      { label: "Smartphones", href: "/UI-Components/Shop?category=Mobile Phone" },
      { label: "Tablets", href: "/UI-Components/Shop?category=Tablet PC" },
      { label: "Laptops", href: "/UI-Components/Shop?category=Laptop" },
    ],
  },
  {
    label: 'TV & Audio',
    href: "#",
    dropdown: [
      { label: "Smart TVs", href: "/UI-Components/Shop?category=TV" },
      { label: "Speakers", href: "/UI-Components/Shop?category=Bluetooth Speakers" },
      { label: "Headphones", href: "/UI-Components/Shop?category=Headphone" },
    ],
  },
  {
    label: 'Wearables',
    href: "#",
    dropdown: [
      { label: "Smart Watches", href: "/UI-Components/Shop?category=Smart Watch" },
      { label: "Fitness Bands", href: "/UI-Components/Shop?category=Action Camera" },
    ],
  },
  {
    label: 'Lifestyle & Gadgets',
    href: "#",
    dropdown: [
      { label: "Gimbals", href: "/UI-Components/Shop?category=Gimbal" },
      { label: "Drones", href: "/UI-Components/Shop?category=Drone" },
      { label: "Smart Home", href: "/UI-Components/Shop?category=Smart Home" },
    ],
  },
  { label: "Accessories", href: "/UI-Components/Shop?category=Accessories" },
];

const BottomNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropDowns, setOpenDropDowns] = useState<Record<string, boolean>>({});
  const [isFixed, setIsFixed] = useState(false);
  const [mounted, setMounted] = useState(false); 
  
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const whatsappNumber = "+8801670424702"; 
  const whatsappMessage = "Hello, I want to know more about your products.";

  const toggleDropDowns = (label: string) => {
    setOpenDropDowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // ২. কার্ট এবং উইশলিস্ট সংখ্যা গণনা (total qty লজিক সহ)
  const loadCounts = useCallback(() => {
    if (typeof window === 'undefined') return;

    const cartKey = getStorageKey('cart'); 
    const wishlistKey = getStorageKey('wishlist');

    try {
      const cartData = localStorage.getItem(cartKey);
      const wishlistData = localStorage.getItem(wishlistKey);

      const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      const wishlist: CartItem[] = wishlistData ? JSON.parse(wishlistData) : [];
    
      // মোট আইটেম সংখ্যা (Quantity) যোগ করা
      const totalCartQty = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
      
      setCartCount(totalCartQty);
      setWishlistCount(wishlist.length);
    } catch (error: unknown) {
      console.error("Error loading counts:", error);
      setCartCount(0);
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setMounted(true);
        loadCounts();
    }, 0);

    window.addEventListener("storageUpdate", loadCounts);
    window.addEventListener("authUpdate", loadCounts);
    window.addEventListener("storage", loadCounts); // অন্য ট্যাব সিঙ্ক

    return () => {
        clearTimeout(timer);
        window.removeEventListener("storageUpdate", loadCounts);
        window.removeEventListener("authUpdate", loadCounts);
        window.removeEventListener("storage", loadCounts);
    };
  }, [loadCounts]);

  if (!mounted) return null; 

  return (
    <>
      <style>{customStyles}</style>

      <div 
        className={`w-full bg-white z-50 transition-all duration-300
        ${isFixed 
          ? "fixed top-0 left-0 shadow-md py-3 animate-smooth-drop" 
          : "relative shadow-sm py-4" 
        }`}
      >
        
        <div className="flex items-center justify-between px-[5%] lg:px-[12%] text-gray-700">
          
          <div className='lg:hidden flex items-center'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='text-2xl focus:outline-none p-1 transition-transform duration-300'
            >
              <i className={`${mobileMenuOpen ? "bi bi-x-lg" : "bi bi-list"} block transition-transform duration-300`}></i>
            </button>
          </div>

          <Link
            href="/"
            className={`text-2xl lg:text-3xl font-black merienda text-black transition-all duration-300 tracking-tighter
              ${isFixed ? "block" : "hidden"} 
            `}
          >
            ENT<span className='text-red-600'>Gadget</span>
          </Link>

          <nav className={`hidden lg:flex space-x-6 relative transition-all duration-300
              ${isFixed ? "mx-auto" : "mr-auto"}
          `}>
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className='relative group z-[999]'>
                  <Link href={link.href} className='flex items-center gap-1 py-2 font-bold text-xs uppercase tracking-widest hover:text-red-600 transition-colors'>
                    {link.label} <i className='bi bi-chevron-down text-[10px]'></i>
                  </Link>
                  <div className='absolute left-0 top-full hidden group-hover:block bg-white shadow-2xl p-3 border border-gray-100 rounded-xl min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200'>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className='block px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-tight hover:bg-red-50 hover:text-red-600 transition-all whitespace-nowrap'
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.label} href={link.href} className="py-2 font-bold text-xs uppercase tracking-widest hover:text-red-600 transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-4 justify-end">
              {isFixed ? (
                <div className="flex items-center gap-5">
                    <Link href='/UI-Components/Pages/wishlist' className='relative text-gray-700 hover:text-red-600 transition-colors'>
                      <i className='bi bi-heart text-xl'></i>
                      {wishlistCount > 0 && (
                        <span className='absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white'>
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link href='/UI-Components/Pages/cart' className='relative text-gray-700 hover:text-red-600 transition-colors'>
                      <i className='bi bi-cart3 text-xl'></i>
                      {cartCount > 0 && (
                        <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white'>
                          {cartCount}
                        </span>
                      )}
                    </Link>
                </div>
              ) : (
                <a 
                   href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="cursor-pointer font-black bg-red-600 text-white px-5 py-2.5 rounded-full flex items-center transition-all hover:bg-black hover:scale-105 gap-2 shadow-lg shadow-red-100 text-[10px] uppercase tracking-widest"
                >
                    <i className='bi bi-whatsapp text-lg'></i> WhatsApp Help
                </a>
              )}
          </div>

          {/* Mobile Cart/Wishlist Icons */}
          <div className='lg:hidden flex items-center gap-4'>
            <Link href='/UI-Components/Pages/wishlist' className='relative text-gray-700'>
              <i className='bi bi-heart text-2xl'></i>
              {wishlistCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href='/UI-Components/Pages/cart' className='relative text-gray-700'>
              <i className='bi bi-cart3 text-2xl'></i>
              {cartCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white'>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`
            lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t z-40 
            overflow-hidden transition-all duration-500 ease-in-out
            ${mobileMenuOpen ? "max-h-[85vh] opacity-100 visible" : "max-h-0 opacity-0 invisible"}
          `}
        >
          <div className="flex flex-col p-6 overflow-y-auto max-h-[80vh] space-y-2">
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-50 last:border-none pb-2">
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropDowns(link.label)}
                      className="flex justify-between items-center w-full py-3 font-bold text-sm uppercase tracking-wider text-gray-800"
                    >
                      {link.label}
                      <i className={`bi bi-chevron-down transition-transform duration-300 ${openDropDowns[link.label] ? 'rotate-180' : ''}`}></i>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropDowns[link.label] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="pl-4 pb-2 bg-gray-50 rounded-xl mt-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)} 
                            className="block py-3 text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-tight"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-4 font-bold text-sm uppercase tracking-wider text-gray-800"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <a 
                 href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center justify-center gap-3 font-black text-white bg-green-500 py-4 rounded-2xl shadow-lg shadow-green-100 uppercase text-xs tracking-widest"
              >
                <i className='bi bi-whatsapp text-xl'></i> Chat with Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;