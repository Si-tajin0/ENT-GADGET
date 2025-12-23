'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { getStorageKey } from '@/app/utiles/storageHelper'; 
// সার্চের জন্য ডাটা ইমপোর্ট
import bestSalesData from '@/app/JsonData/BestSales.json'; 
import shortProductsData from '@/app/JsonData/ShortProducts.json';

// === কাস্টম এনিমেশন স্টাইল ===
const customStyles = `
  @keyframes smoothSlideDown {
    0% { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-smooth-drop { animation: smoothSlideDown 0.5s ease-in-out forwards; }
`;

interface Product {
  _id?: string;
  Id?: number | string;
  title: string;
  image: string;
  price: string | number;
  qty?: number;
}

// ESLint any এরর ফিক্স করার জন্য ইন্টারফেস
interface ShortProductsType {
  Featured?: Product[];
  TopSelling?: Product[];
  OnSale?: Product[];
  TopRated?: Product[];
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

  // সার্চ স্টেট
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const whatsappNumber = "+8801670424702"; 
  const whatsappMessage = "Hello, I want to know more about your products.";

  const toggleDropDowns = (label: string) => {
    setOpenDropDowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // সার্চ ডাটা লোড (any ফিক্সড)
  const loadSearchData = useCallback(async () => {
    try {
      const shortData = shortProductsData as ShortProductsType;
      const local = [
        ...(bestSalesData as Product[]), 
        ...(shortData.Featured || []), 
        ...(shortData.TopSelling || [])
      ];
      const res = await fetch('/api/products');
      const db = res.ok ? await res.json() : [];
      setAllProducts([...local, ...db]);
    } catch (e) {
      console.error("Search data error", e);
    }
  }, []);

  const loadCounts = useCallback(() => {
    if (typeof window === 'undefined') return;
    const cartKey = getStorageKey('cart'); 
    const wishlistKey = getStorageKey('wishlist');
    try {
      const cartData = localStorage.getItem(cartKey);
      const wishlistData = localStorage.getItem(wishlistKey);
      const cart: Product[] = cartData ? JSON.parse(cartData) : [];
      const wishlist: Product[] = wishlistData ? JSON.parse(wishlistData) : [];
      setCartCount(cart.reduce((acc, item) => acc + (item.qty || 1), 0));
      setWishlistCount(wishlist.length);
    } catch (error) {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);

    const timer = setTimeout(() => {
        setMounted(true);
        loadCounts();
        loadSearchData();
    }, 0);

    window.addEventListener("storageUpdate", loadCounts);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("storageUpdate", loadCounts);
        clearTimeout(timer);
    };
  }, [loadCounts, loadSearchData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    if (text.length > 0) {
      setFilteredProducts(allProducts.filter(p => p.title.toLowerCase().includes(text.toLowerCase())).slice(0, 6));
    } else setFilteredProducts([]);
  };

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
              <i className={`${mobileMenuOpen ? "bi bi-x-lg text-black" : "bi bi-list text-black"} block transition-transform duration-300`}></i>
            </button>
          </div>

          <Link
            href="/"
            className={`text-2xl lg:text-3xl font-bold merienda text-black transition-all duration-300 tracking-tighter
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
                <div key={link.label} className='relative group z-[99999]'>
                  <Link href={link.href} className='flex items-center gap-1 py-2 hover:text-red-600'>
                    {link.label} <i className='bi bi-chevron-down text-[10px]'></i>
                  </Link>
                  <div className='absolute left-0 top-full hidden group-hover:block bg-white shadow-xl p-2 border border-gray-100 rounded-lg min-w-[200px]'>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className='block px-4 py-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-all whitespace-nowrap'
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.label} href={link.href} className="py-2 hover:text-red-600">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* রাইট সাইড: হোয়াটসঅ্যাপ, সার্চ অথবা আইকনসমূহ */}
          <div className="flex items-center gap-4 justify-end relative">
              
              {/* ১. স্টিকি হলে কার্ট ও উইশলিস্ট দেখাবে (ডেক্সটপ ও মোবাইল উভয় জায়গায়) */}
              {isFixed ? (
                <div className="flex items-center gap-5 animate-in fade-in duration-300">
                    <Link href='/UI-Components/Pages/wishlist' className='relative text-gray-700 hover:text-red-600 transition-colors'>
                      <i className='bi bi-heart text-2xl'></i>
                      <span className='absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white'>
                        {wishlistCount}
                      </span>
                    </Link>

                    <Link href='/UI-Components/Pages/cart' className='relative text-gray-700 hover:text-red-600 transition-colors'>
                      <i className='bi bi-cart3 text-2xl'></i>
                      <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white'>
                        {cartCount}
                      </span>
                    </Link>
                </div>
              ) : (
                /* ২. স্টিকি না হলে যা দেখাবে */
                <div className="flex items-center gap-3">
                    
                    {/* মোবাইল ভিউতে সার্চ (lg:hidden) */}
                    <div className='lg:hidden flex items-center relative'>
                       {isSearchOpen ? (
                          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-gray-200 animate-in fade-in slide-in-from-right-2">
                             <input 
                                 type="text" autoFocus placeholder="Search..." 
                                 className="bg-transparent text-xs font-bold outline-none w-28 text-black"
                                 value={query} onChange={handleSearch}
                             />
                             <button onClick={() => {setIsSearchOpen(false); setQuery("");}} className="ml-2 text-red-600">
                                <i className="bi bi-x-circle-fill"></i>
                             </button>
                          </div>
                       ) : (
                          <button onClick={() => setIsSearchOpen(true)} className="text-xl text-black p-2">
                             <i className="bi bi-search"></i>
                          </button>
                       )}
                    </div>

                    {/* ডেক্সটপ হোয়াটসঅ্যাপ বাটন */}
                    <div className="hidden lg:block">
                         <a 
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="nav-button cursor-pointer font-bold bg-red-600 text-white px-5 py-2 rounded flex items-center transition-transform hover:scale-105 gap-2"
                         >
                             <i className='bi bi-whatsapp text-xl'></i> 01670424702
                         </a>
                    </div>
                </div>
              )}

              {/* সার্চ ড্রপডাউন রেজাল্ট */}
              {query && isSearchOpen && !isFixed && (
                  <div className="absolute top-full right-0 w-64 bg-white shadow-2xl mt-2 rounded-2xl overflow-hidden border border-gray-100 z-[2000] lg:hidden">
                      {filteredProducts.map((p, i) => (
                          <Link key={i} href={`/UI-Components/Shop?id=${p._id || p.Id}`} onClick={() => {setQuery(""); setIsSearchOpen(false);}}>
                              <div className="flex items-center gap-3 p-3 border-b border-gray-50 hover:bg-gray-50">
                                  <div className="w-8 h-8 relative shrink-0">
                                      <img src={p.image} className="w-full h-full object-contain" alt="" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase text-black truncate">{p.title}</span>
                              </div>
                          </Link>
                      ))}
                  </div>
              )}
          </div>

        </div>

        {/* মোবাইল মেনু ড্রপডাউন */}
        <div 
          className={`
            lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t z-40 
            overflow-hidden transition-all duration-500 ease-in-out origin-top
            ${mobileMenuOpen ? "max-h-[85vh] opacity-100 visible" : "max-h-0 opacity-0 invisible"}
          `}
        >
          <div className="flex flex-col p-4 overflow-y-auto max-h-[80vh]">
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-100 last:border-none">
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropDowns(link.label)}
                      className="flex justify-between items-center w-full py-3 font-bold text-sm uppercase text-black"
                    >
                      {link.label}
                      <i className={`bi bi-chevron-down transition-transform duration-300 ${openDropDowns[link.label] ? 'rotate-180 text-red-600' : ''}`}></i>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropDowns[link.label] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="pl-4 pb-2 bg-gray-50 rounded-md">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)} 
                            className="block py-2 text-xs font-bold text-gray-600 hover:text-red-600"
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
                    className="block py-3 font-bold text-sm uppercase text-black hover:text-red-600"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;