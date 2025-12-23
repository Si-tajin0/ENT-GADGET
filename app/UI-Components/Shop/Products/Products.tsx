"use client"

import React, { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaFilter, FaTimes, FaCartPlus, FaChevronRight } from 'react-icons/fa';

// JSON ডাটা ইমপোর্ট
import bestSalesData from "@/app/JsonData/BestSales.json";
import hotDealsData from "@/app/JsonData/HotDeals.json";
import arraivlesData from "@/app/JsonData/Arraivles.json";
import topSellingData from "@/app/JsonData/TopSelling.json";
import shortProductsData from "@/app/JsonData/ShortProducts.json";
import { getStorageKey } from '@/app/utiles/storageHelper'; 

interface ProductType {
    _id?: string;
    Id?: number | string;
    image: string;
    title: string;
    price: string | number;
    sale?: string;
    qty?: number;
    lessPrice?: string;
    review?: string;
    ctg?: string;
    category?: string;
    [key: string]: unknown;
}

interface ShortProductsStructure {
    Featured?: ProductType[];
    OnSale?: ProductType[];
    TopSelling?: ProductType[];
    TopRated?: ProductType[];
}

const categoriesList = [
    "All", "Drone", "Gimbal", "Tablet PC", "TV", "Mobile Phone",
    "Mobile Accessories", "Portable SSD", "Camera", "Trimmer",
    "Smart Watch", "Earbuds", "Bluetooth Speakers", "Gaming Console", "Headphone", "Power Bank", "Smart Home"
];

const Products = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const initialCategory = useMemo(() => {
    return categoryParam ? decodeURIComponent(categoryParam) : "All";
  }, [categoryParam]);

  const [price, setPrice] = useState(150000); 
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // মোবাইলের জন্য ফিল্টার স্টেট
  const [mounted, setMounted] = useState(false);
  const [dbProducts, setDbProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const fetchDbProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setDbProducts(data as ProductType[]);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };
    fetchDbProducts();
    return () => clearTimeout(timer);
  }, []);

  const allProducts = useMemo(() => {
      const shortData = shortProductsData as ShortProductsStructure;
      const extraProducts = [
        ...(shortData.Featured || []),
        ...(shortData.OnSale || []),
        ...(shortData.TopSelling || []),
        ...(shortData.TopRated || []),
      ];

      const combined = [
          ...(bestSalesData as ProductType[]),
          ...(hotDealsData as ProductType[]),
          ...(arraivlesData as ProductType[]),
          ...(topSellingData as ProductType[]),
          ...extraProducts,
          ...dbProducts
      ];

      const uniqueMap = new Map<string, ProductType>();
      combined.forEach(item => {
          const id = String(item._id || item.Id);
          if (!uniqueMap.has(id)) {
              uniqueMap.set(id, item);
          }
      });
      return Array.from(uniqueMap.values());
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
      let result = allProducts;
      result = result.filter((p) => parseFloat(String(p.price).replace(/[^0-9.]/g, "")) <= price);

      if (selectedCategory !== "All") {
          result = result.filter((p) => {
             const catValue = (p.ctg || p.category || "").toLowerCase();
             const titleValue = p.title.toLowerCase();
             return catValue === selectedCategory.toLowerCase() || titleValue.includes(selectedCategory.toLowerCase());
          });
      }
      return result;
  }, [price, selectedCategory, allProducts]);

  const handleReset = () => {
    setPrice(150000);
    setSelectedCategory("All");
    toast.success("Filters Reset!");
  };

  const handleAddToCart = (product: ProductType) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: ProductType[] = storedCart ? JSON.parse(storedCart) : [];
    const currentId = String(product._id || product.Id);
    if (cart.some((item) => String(item._id || item.Id) === currentId)) {
        toast.error("Already in cart!");
    } else {
        localStorage.setItem(cartKey, JSON.stringify([...cart, { ...product, qty: 1 }]));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success("Added to cart!");
    }
  };

  if (!mounted) return null;

  return (
    <div className="px-[4%] lg:px-[10%] py-6 md:py-10 bg-gray-50 min-h-screen font-sans">
      
      {/* মোবাইল ফিল্টার বাটন */}
      <div className="lg:hidden mb-4 flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          <span className="font-black text-xs uppercase tracking-widest text-gray-500">
            {selectedCategory} <span className="text-red-600">({filteredProducts.length})</span>
          </span>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-tighter"
          >
            <FaFilter /> Filters
          </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
          
          {/* SIDEBAR (ডেক্সটপে সবসময় দেখা যাবে, মোবাইলে ড্রয়ার হবে) */}
          <div className={`
            fixed inset-y-0 left-0 z-[2000] w-72 bg-white p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 lg:p-0 lg:bg-transparent lg:w-1/4
            ${isFilterOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          `}>
            <div className="flex items-center justify-between lg:hidden mb-6">
                <h3 className="unbounded text-lg font-bold">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-2xl text-gray-400"><FaTimes /></button>
            </div>

            <div className="sticky top-24 space-y-6">
                {/* Price Filter */}
                <div className="border border-gray-100 shadow-sm rounded-2xl p-6 bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className='text-xs font-black text-gray-400 uppercase tracking-widest'>Price Range</h3>
                        <button onClick={handleReset} className='text-[10px] font-black text-red-600 uppercase hover:underline'>Reset</button>
                    </div>
                    <input
                        type="range" min={0} max={150000} value={price}
                        onChange={(e) => setPrice(Number(e.target.value))} 
                        className='w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600'
                    />
                    <div className="mt-4 font-black text-red-600 text-lg tracking-tighter">
                        ৳{price.toLocaleString()}
                    </div>
                </div>

                {/* Categories List */}
                <div className="border border-gray-100 shadow-sm rounded-2xl p-6 bg-white">
                    <h3 className='text-xs font-black mb-6 text-gray-400 uppercase tracking-widest'>Categories</h3>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {categoriesList.map((cat, index) => (
                            <div 
                                key={index} 
                                onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                                className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-300 group
                                    ${selectedCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <span className="text-[11px] font-black uppercase tracking-tight">{cat}</span>
                                <FaChevronRight className={`text-[10px] ${selectedCategory === cat ? 'block' : 'hidden group-hover:block opacity-30'}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 hidden lg:flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-gray-800 font-black uppercase text-xs tracking-widest">
                    Showing: <span className="text-red-600 ml-1">{selectedCategory}</span> 
                    <span className="text-gray-400 ml-4 font-bold">[{filteredProducts.length} Items]</span>
                </span>
            </div>
            
            {/* ২-কলাম গ্রিড মোবাইলের জন্য */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => {
                    const uniqueID = String(product._id || product.Id);
                    const priceNum = parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
                    return (
                        <div key={uniqueID} className='group border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden'>
                            
                            <Link href={`/UI-Components/Shop?id=${uniqueID}`} className="cursor-pointer">
                                <div className='relative flex items-center justify-center w-full h-[140px] md:h-[200px] overflow-hidden rounded-xl md:rounded-2xl bg-gray-50 mb-3 md:mb-5'>
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-2 md:p-4'
                                    />
                                    {product.sale && (
                                        <span className="absolute top-0 right-0 px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-black text-white rounded-bl-xl bg-red-600 uppercase shadow-md">{product.sale}</span>
                                    )}
                                </div>

                                <h2 className='text-[10px] md:text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors h-7 md:h-10 mb-2 md:mb-4 uppercase tracking-tighter leading-tight'>
                                    {product.title}
                                </h2>
                            </Link>

                            <div className="flex items-center justify-between mt-auto pt-2 md:pt-4 border-t border-gray-50">
                                <div className="flex flex-col">
                                    <span className='text-sm md:text-xl font-black text-red-600 leading-none tracking-tighter'>৳{priceNum.toLocaleString()}</span>
                                    {product.lessPrice && <span className='text-[8px] md:text-[10px] text-gray-400 line-through mt-1 font-bold tracking-tighter opacity-60'>৳{String(product.lessPrice).replace(/[^0-9.]/g, "")}</span>}
                                </div>
                                <button 
                                    onClick={() => handleAddToCart(product)} 
                                    className='w-8 h-8 md:w-11 md:h-11 bg-gray-900 text-white rounded-lg md:rounded-full flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer shadow-lg active:scale-90'
                                >
                                    <FaCartPlus className="text-xs md:text-lg" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-[2rem] bg-white opacity-50">
                        <p className="font-black text-gray-400 uppercase tracking-widest text-sm">No items found</p>
                    </div>
                )}
            </div>
          </div>
      </div>
      
      {/* মোবাইলে ব্যাকড্রপ (যখন ফিল্টার ওপেন থাকবে) */}
      {isFilterOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-[1999] lg:hidden"
            onClick={() => setIsFilterOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default Products;