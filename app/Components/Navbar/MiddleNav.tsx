'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getStorageKey } from '@/app/utiles/storageHelper';

// সার্চের জন্য ডাটা ইমপোর্ট
import bestSalesData from '@/app/JsonData/BestSales.json';
import shortProductsData from '@/app/JsonData/ShortProducts.json';

// ১. আইটেমের জন্য ইন্টারফেস
interface Product {
  _id?: string;
  Id?: string | number;
  qty?: number;
  title: string;
  image: string;
  price: string | number;
}

// ২. ShortProducts JSON এর গঠনের জন্য ইন্টারফেস (any এরর দূর করতে)
interface ShortProductsStructure {
  Featured?: Product[];
  TopSelling?: Product[];
  OnSale?: Product[];
  TopRated?: Product[];
}

const MiddleNav = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  // সার্চ স্টেট
  const [query, setQuery] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // লোগো ক্লিক করলে স্মুথ স্ক্রল টু টপ
  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // কার্ট এবং উইশলিস্ট কাউন্ট লোড
  const loadCounts = useCallback(() => {
    if (typeof window === 'undefined') return;
    const cartKey = getStorageKey('cart');
    const wishlistKey = getStorageKey('wishlist');
    
    const cart: Product[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const wishlist: Product[] = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    
    setCartCount(cart.reduce((acc: number, item: Product) => acc + (item.qty || 1), 0));
    setWishlistCount(wishlist.length);
  }, []);

  // সার্চের জন্য সব ডাটা (JSON + DB) লোড করা (any ফিক্সড)
  const loadSearchData = useCallback(async () => {
    try {
      const shortData = shortProductsData as ShortProductsStructure;
      const local: Product[] = [
        ...(bestSalesData as Product[]),
        ...(shortData.Featured || []),
        ...(shortData.TopSelling || [])
      ];
      
      const res = await fetch('/api/products');
      const db: Product[] = res.ok ? await res.json() : [];
      
      // ডুপ্লিকেট আইডি রিমুভ করে মার্জ করা
      const combined = [...local, ...db];
      const uniqueProducts = Array.from(
        new Map(combined.map(p => [p._id || p.Id, p])).values()
      );
      setAllProducts(uniqueProducts);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Search data load error";
      console.error(errorMsg);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      loadCounts();
      loadSearchData();
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
  }, [loadCounts, loadSearchData]);

  // সার্চ হ্যান্ডলার
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    if (text.length > 0) {
      const results = allProducts.filter(p =>
        p.title.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 8);
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const formatPriceDisplay = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  if (!mounted) return null;

  return (
    <div className="w-full border-b border-gray-200 bg-white z-[1000]">
      <div className="flex items-center justify-between py-4 px-[5%] lg:px-[12%]">

        <Link 
          href='/' 
          onClick={handleLogoClick}
          className='text-2xl lg:text-3xl font-black merienda text-black tracking-tighter uppercase'
        >
          ENT<span className='text-red-600'>Gadget</span>
        </Link>

        {/* সার্চ বার */}
        <div className="flex-1 ms-6 mx-6 max-w-xl relative hidden lg:flex flex-col">
          <div className="flex items-center w-full">
            <input
              type="text"
              placeholder='Search gadgets, brands...'
              className='w-full border-2 px-4 py-2 border-gray-100 outline-none rounded-s-xl focus:border-red-600 bg-gray-50 transition-all font-bold text-sm text-black'
              value={query}
              onChange={handleSearch}
            />
            <button className='bg-red-600 text-white px-5 py-2.5 cursor-pointer rounded-r-xl hover:bg-black transition-all'>
              <i className='bi bi-search'></i>
            </button>
          </div>

          {query && (
            <div className="absolute top-full left-0 w-full bg-white shadow-2xl mt-2 rounded-2xl overflow-hidden border border-gray-100 z-[2000] p-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const pId = product._id || product.Id;
                  return (
                    <Link 
                      key={index} 
                      href={`/UI-Components/Shop?id=${pId}`}
                      onClick={() => setQuery("")}
                    >
                      <div className="flex items-center gap-4 p-3 hover:bg-red-50 border-b border-gray-50 last:border-none transition-all cursor-pointer rounded-xl group">
                        <div className="w-12 h-12 relative border rounded-lg bg-white overflow-hidden p-1 shrink-0">
                          <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-gray-800 line-clamp-1 uppercase tracking-tight">{product.title}</h4>
                          <p className="text-xs text-red-600 font-black mt-0.5">{formatPriceDisplay(product.price)}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No gadgets found.</div>
              )}
            </div>
          )}
        </div>

        {/* আইকনসমূহ */}
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