'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
// লোকাল ডাটা ইমপোর্ট
import bestSalesData from '@/app/JsonData/BestSales.json'; 
import shortProductsData from '@/app/JsonData/ShortProducts.json';
import { getStorageKey } from '@/app/utiles/storageHelper'; 

// ১. টাইপ ইন্টারফেস ডিফাইন (any দূর করার জন্য)
interface Product {
  _id?: string;        
  Id?: string | number; 
  title: string;
  image: string;
  price: string | number;
  qty?: number;
}

interface ShortProductsStructure {
  Featured?: Product[];
  TopSelling?: Product[];
  OnSale?: Product[];
  TopRated?: Product[];
}

const MiddleNav = () => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(""); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [allProducts, setAllProducts] = useState<Product[]>([]); 
  const [mounted, setMounted] = useState<boolean>(false);

  // ২. কার্ট এবং উইশলিস্ট সংখ্যা গণনা
  const loadCounts = useCallback(() => {
    if (typeof window === 'undefined') return;

    const cartKey = getStorageKey('cart'); 
    const wishlistKey = getStorageKey('wishlist');
  
    const storedCart = localStorage.getItem(cartKey);
    const storedWishlist = localStorage.getItem(wishlistKey);

    const cart: Product[] = storedCart ? JSON.parse(storedCart) : [];
    const wishlist: Product[] = storedWishlist ? JSON.parse(storedWishlist) : [];
    
    // মোট কোয়ান্টিটি যোগ করা
    const totalCartQty = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
    setCartCount(totalCartQty);
    setWishlistCount(wishlist.length);
  }, []);

  // ৩. সার্চের জন্য সব ডাটা মার্জ করা (any ছাড়া)
  const loadSearchData = useCallback(async () => {
    try {
      const shortData = shortProductsData as ShortProductsStructure;
      const featured = shortData.Featured || [];
      const topSelling = shortData.TopSelling || [];
      const onSale = shortData.OnSale || [];
      
      const localProducts: Product[] = [
        ...(bestSalesData as Product[]), 
        ...featured, 
        ...topSelling, 
        ...onSale
      ];

      // ডাটাবেস থেকে প্রোডাক্ট নিয়ে আসা
      const res = await fetch('/api/products');
      const dbProducts: Product[] = res.ok ? await res.json() : [];

      setAllProducts([...localProducts, ...dbProducts]);
    } catch (error: unknown) {
      console.error("Search data load error:", error);
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
    const searchText = e.target.value;
    setQuery(searchText);
    if (searchText.length > 0) {
      const results = allProducts.filter((product) =>
        product.title && product.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(results.slice(0, 10)); 
    } else {
      setFilteredProducts([]);
    }
  };

  const closeSearch = () => {
    setQuery("");
    setFilteredProducts([]);
    setIsSearchOpen(false);
  };

  const formatPriceDisplay = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  if (!mounted) return null;

  return (
    <>
      <div className="w-full relative border-b border-gray-200 bg-white z-[1000]">
        <div className="flex items-center justify-between py-4 px-[5%] lg:px-[12%]">
          
          <Link href='/' className='text-2xl lg:text-3xl font-black merienda text-black tracking-tighter uppercase'>
            ENT<span className='text-red-600'>Gadget</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="flex-1 ms-6 mx-0 lg:mx-6 max-w-xl relative hidden lg:flex">
            <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder='Search for products...'
                  className='w-full border-2 px-4 py-2 border-gray-100 outline-none rounded-s-xl focus:border-red-600 bg-gray-50 transition-all font-bold text-sm'
                  value={query}
                  onChange={handleSearch}
                />
                
                {query && (
                    <div className="absolute top-[110%] left-0 w-full bg-white shadow-2xl border border-gray-100 rounded-2xl max-h-[450px] overflow-y-auto z-[2000] p-2">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => {
                                const pId = product._id || product.Id;
                                return (
                                    <Link key={index} href={`/UI-Components/Shop?id=${pId}`} onClick={closeSearch}>
                                        <div className="flex items-center gap-4 p-3 hover:bg-red-50 border-b border-gray-50 transition-all cursor-pointer rounded-xl group">
                                            <div className="w-12 h-12 relative border rounded-lg bg-white overflow-hidden p-1 flex-shrink-0">
                                                <img src={product.image} alt={product.title} className="w-full h-full object-contain"/>
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-gray-800 line-clamp-1 uppercase tracking-tight">{product.title}</h4>
                                                <p className="text-xs text-red-600 font-black mt-1">{formatPriceDisplay(product.price)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No results found</div>
                        )}
                    </div>
                )}
            </div>
            <button className='bg-red-600 text-white px-5 cursor-pointer rounded-r-xl hover:bg-black transition-all'>
              <i className='bi bi-search'></i>
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden text-2xl text-gray-700 p-2">
                <i className={isSearchOpen ? "bi bi-x-lg" : "bi bi-search"}></i>
            </button>
            
            <Link href='/UI-Components/Pages/wishlist' className='relative p-2 group'>
              <i className='bi bi-heart text-gray-700 text-2xl group-hover:text-red-600 transition-colors'></i>
              {wishlistCount > 0 && (
                <span className='absolute top-0 right-0 rounded-full bg-red-600 w-5 h-5 text-[10px] font-black flex items-center justify-center text-white border-2 border-white shadow-sm'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/UI-Components/Pages/cart" className='relative p-2 group'>
              <i className='bi bi-cart3 text-gray-700 text-2xl group-hover:text-red-600 transition-colors'></i>
              {cartCount > 0 && (
                <span className='absolute top-0 right-0 rounded-full bg-black w-5 h-5 text-[10px] font-black flex items-center justify-center text-white border-2 border-white shadow-sm animate-bounce'>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-b border-gray-100 p-4 z-[1001]">
                <div className="flex w-full mb-2">
                    <input
                        type="text"
                        placeholder='Search...'
                        className='flex-1 border-2 px-4 py-3 border-gray-100 outline-none rounded-s-xl bg-gray-50 font-bold'
                        value={query}
                        onChange={handleSearch}
                        autoFocus
                    />
                    <button className='bg-red-600 text-white px-5 rounded-r-xl'><i className='bi bi-search'></i></button>
                </div>
                {query && filteredProducts.length > 0 && (
                    <div className="bg-white rounded-xl max-h-[300px] overflow-y-auto border border-gray-100 p-2">
                        {filteredProducts.map((product, index) => (
                            <Link key={index} href={`/UI-Components/Shop?id=${product._id || product.Id}`} onClick={closeSearch}>
                                <div className="flex items-center gap-4 p-3 border-b last:border-none">
                                    <img src={product.image} alt={product.title} className="w-10 h-10 object-contain"/>
                                    <span className="text-[10px] font-black uppercase text-gray-800 line-clamp-1">{product.title}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </>
  )
}

export default MiddleNav;