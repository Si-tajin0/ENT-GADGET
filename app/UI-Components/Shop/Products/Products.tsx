"use client"

import React, { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// === ১. সব JSON ডাটা ইমপোর্ট ===
import bestSalesData from "@/app/JsonData/BestSales.json";
import hotDealsData from "@/app/JsonData/HotDeals.json";
import arraivlesData from "@/app/JsonData/Arraivles.json";
import topSellingData from "@/app/JsonData/TopSelling.json";
import shortProductsData from "@/app/JsonData/ShortProducts.json";

import { getStorageKey } from '@/app/utiles/storageHelper'; 

// ইন্টারফেস ডিফাইন
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
    sold?: string;
    ctg?: string;
    category?: string;
    [key: string]: unknown;
}

// ShortProducts JSON এর গঠনের জন্য ইন্টারফেস (any এরর দূর করতে)
interface ShortProductsStructure {
    Featured?: ProductType[];
    OnSale?: ProductType[];
    TopSelling?: ProductType[];
    TopRated?: ProductType[];
}

const categoriesList = [
    "All", "Drone", "Gimbal", "Tablet PC", "TV", "Mobile Phone",
    "Mobile Accessories", "Portable SSD", "Camera", "Trimmer",
    "Smart Watch", "Action Camera", "Earbuds", "Bluetooth Speakers", "Gaming Console", "Headphone", "Power Bank",  "Smart Home"
];

const Products = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const initialCategory = useMemo(() => {
    return categoryParam ? decodeURIComponent(categoryParam) : "All";
  }, [categoryParam]);

  // States
  const [price, setPrice] = useState(150000); 
  const [discount30, setDiscount30] = useState(false);
  const [discount50, setDiscount50] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const [mounted, setMounted] = useState(false);
  const [randomProduct, setRandomProduct] = useState<ProductType | null>(null);
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
        } catch (error: unknown) {
            console.error("Failed to fetch products:", error);
        }
    };

    fetchDbProducts();
    return () => clearTimeout(timer);
  }, []);

  // ডাটা মার্জিং লজিক
  const allProducts = useMemo(() => {
      // shortProductsData কে সঠিক টাইপে কাস্ট করা হলো (any ছাড়া)
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

      // ডুপ্লিকেট রিমুভ (নিখুঁত ID চেক)
      const uniqueMap = new Map<string, ProductType>();
      combined.forEach(item => {
          const id = String(item._id || item.Id);
          if (!uniqueMap.has(id)) {
              uniqueMap.set(id, item);
          }
      });

      return Array.from(uniqueMap.values());
  }, [dbProducts]);

  useEffect(() => {
    if (mounted && allProducts.length > 0 && !randomProduct) {
        setRandomProduct(allProducts[Math.floor(Math.random() * allProducts.length)]);
    }
  }, [mounted, allProducts, randomProduct]);

  const filteredProducts = useMemo(() => {
      let result = allProducts;
      result = result.filter((p) => {
        const productPrice = parseFloat(String(p.price).replace(/[^0-9.]/g, ""));
        return productPrice <= price;
      });

      if (selectedCategory !== "All") {
          result = result.filter((p) => {
             const catValue = (p.ctg || p.category || "").toLowerCase();
             const titleValue = p.title.toLowerCase();
             return catValue === selectedCategory.toLowerCase() || titleValue.includes(selectedCategory.toLowerCase());
          });
      }

      if (discount50) result = result.filter((p) => String(p.sale).includes("50%"));
      if (discount30) result = result.filter((p) => String(p.sale).includes("30%"));
      if (isNew) result = result.filter((p) => p.sale === "New");
      
      return result;
  }, [price, discount30, discount50, isNew, selectedCategory, allProducts]);

  const formatPrice = (p: string | number) => {
    const num = String(p).replace(/[^0-9.]/g, "");
    return `৳${Number(num).toLocaleString()}`;
  };

  const handleReset = () => {
    setPrice(150000);
    setDiscount30(false);
    setDiscount50(false);
    setIsNew(false);
    setSelectedCategory("All");
    toast.success("Filters Reset Successfully!");
  };

  // কার্ট লজিক (ESLint Prefer-const fixed)
  const handleAddToCart = (product: ProductType) => {
    const cartKey = getStorageKey('cart');
    const storedCart = localStorage.getItem(cartKey);
    const cart: ProductType[] = storedCart ? JSON.parse(storedCart) : [];

    const currentId = String(product._id || product.Id);

    // চেক করা হচ্ছে আইডি কার্টে আছে কি না
    const isExist = cart.some((item) => String(item._id || item.Id) === currentId);

    if (isExist) {
        toast.error(`${product.title} already in cart!`, { icon: '⚠️' });
    } else {
        const updatedCart = [...cart, { ...product, qty: 1 }];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageUpdate"));
        toast.success(`${product.title} added to cart!`);
    }
};

  if (!mounted) return null;

  return (
    <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-8">
          
          {/* SIDEBAR */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="sticky top-24 space-y-6">
                <div className="border border-gray-200 shadow-sm rounded-2xl p-6 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <h3 className='text-md font-black text-gray-800 uppercase tracking-tighter'>Price Range</h3>
                        <button onClick={handleReset} className='text-[10px] font-black text-red-600 cursor-pointer hover:bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase transition-all'>Reset</button>
                    </div>
                    <input
                        type="range" min={0} max={150000} value={price}
                        onChange={(e) => setPrice(Number(e.target.value))} 
                        className='w-full accent-red-600 cursor-pointer'
                    />
                    <div className="flex justify-between mt-3 font-black text-red-600 text-sm">
                        <span>৳0</span>
                        <span>৳{price.toLocaleString()}</span>
                    </div>
                </div>

                <div className="border border-gray-200 shadow-sm rounded-2xl p-6 bg-white">
                    <h3 className='text-md font-black mb-4 border-b border-gray-100 pb-4 text-gray-800 uppercase tracking-tighter'>Categories</h3>
                    <div className="space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                        {categoriesList.map((cat, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-300
                                    ${selectedCategory === cat ? 'bg-red-600 text-white shadow-lg shadow-red-100 font-bold' : 'hover:bg-gray-50 text-gray-500'}`}
                            >
                                <span className="text-xs uppercase font-black tracking-widest">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="mb-6 flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-gray-800 font-black uppercase text-xs tracking-widest">
                    Showing: <span className="text-red-600 ml-1">{selectedCategory}</span> 
                    <span className="text-gray-300 mx-2">|</span>
                    <span className="text-gray-400">{filteredProducts.length} Items</span>
                </span>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const uniqueID = String(product._id || product.Id);
                    return (
                        <div key={uniqueID} className='group border border-gray-100 rounded-[2rem] p-5 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden'>
                            <Link href={`/UI-Components/Shop?id=${uniqueID}`} className="cursor-pointer">
                                <div className='relative flex items-center justify-center w-full h-[200px] overflow-hidden rounded-2xl bg-gray-50 mb-5 border border-gray-50'>
                                    <img src={product.image} alt={product.title} className='max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4' />
                                    {product.sale && (
                                        <span className="absolute top-0 right-0 px-4 py-1.5 text-[10px] font-black text-white rounded-bl-2xl bg-red-600 uppercase shadow-md tracking-tighter">{product.sale}</span>
                                    )}
                                </div>
                                <h2 className='text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors h-10 mb-4 uppercase tracking-tighter leading-tight'>{product.title}</h2>
                            </Link>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <div className="flex flex-col">
                                    <span className='text-xl font-black text-red-600 leading-none tracking-tighter'>{formatPrice(product.price)}</span>
                                    {product.lessPrice && <span className='text-[10px] text-gray-400 line-through mt-1 font-bold tracking-tighter'>{formatPrice(product.lessPrice)}</span>}
                                </div>
                                <button onClick={() => handleAddToCart(product)} className='w-11 h-11 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer shadow-lg active:scale-90 shadow-gray-200'><i className='bi bi-cart-plus text-xl'></i></button>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>

      </div>
    </div>
  )
}

export default Products;