"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import satisfactionIcon from '@/public/images/satisfaction-icon.webp';
import Deals from '../../Index/Deals/Deals';
// Storage Helper Import
import { getStorageKey } from '@/app/utiles/storageHelper'; 

// ইন্টারফেস আপডেট (সব ফিল্ড অপশনাল করা হয়েছে যাতে এরর না আসে)
export interface ProductType {
    Id: number | string;
    _id?: string;
    image: string;
    title: string;
    description?: string; // ? দেওয়া হয়েছে
    keyFeatures?: string[]; // ? দেওয়া হয়েছে
    price: string;
    sale?: string;
    qty?: number;
    lessPrice?: string;
    review?: string;
    sold?: string;
    ctg?: string;
    category?: string; // ডাটাবেসের জন্য
    fastCharging?: string;
    waterResistant?: string;
    Wireless?: string;
    [key: string]: unknown;
}

interface Props {
  id?: string;
  products: ProductType[];
}

const ProductDetails = ({id, products}: Props) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product: ProductType) => {
    const cartKey = getStorageKey('cart'); 
    const cart: ProductType[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    // Id অথবা _id দিয়ে চেক করা হচ্ছে
    const pId = product.Id || product._id;
    const existingProduct = cart.find((item) => (item.Id || item._id) === pId);

    if (existingProduct) {
      toast('This product is already in your cart!', { icon: '⚠️' });
    } else {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success(`${product.title} added to cart!`);
    }
  };

  const handleAddToWishlist = (product: ProductType) => {
    const wishlistKey = getStorageKey('wishlist'); 
    const wishlist: ProductType[] = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    const pId = product.Id || product._id;
    const existingProduct = wishlist.find((item) => (item.Id || item._id) === pId);

    if (existingProduct) {
      toast('Already in your Wishlist!', { icon: '⚠️' });
    } else {
      wishlist.push(product);
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      window.dispatchEvent(new Event("storageUpdate"));
      toast.success(`${product.title} added to Wishlist!`);
    }
  };

  if (!mounted) return null;

  // View 1: All Products
  if (!id) {
    return (
      <div className="px-[5%] lg:px-[12%] py-10">
        <h1 className="text-3xl font-bold mb-6 unbounded">All Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product._id || product.Id} 
              href={`/UI-Components/Shop?id=${product._id || product.Id}`}
              className="border p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white group cursor-pointer"
            >
              <div className="relative h-40 w-full mb-4 overflow-hidden">
                 <img 
                    src={product.image} 
                    alt={product.title} 
                    className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
                 />
              </div>
              <h2 className='font-bold mt-2 text-sm line-clamp-1 group-hover:text-red-600 transition-colors uppercase'>{product.title}</h2>
              <div className="flex gap-2 mt-1">
                  <p className='text-red-600 font-bold'>৳{String(product.price).replace(/[^0-9]/g, "")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // View 2: Find Current Product
  const currentProduct = products.find((item) => String(item.Id || item._id) === String(id));

  if (!currentProduct) {
    return <div className="py-20 text-center text-xl font-bold text-red-500">Product Not Found!</div>;
  }

  return (
    <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50">
        
        <div className="flex flex-col xl:flex-row gap-8">
            {/* Left: Product Info */}
            <div className="w-full xl:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 border border-gray-100 rounded-xl p-4 flex items-center justify-center bg-gray-50">
                        <div className="relative w-full h-[350px]">
                            <img src={currentProduct.image} alt={currentProduct.title} className='w-full h-full object-contain' />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-3xl unbounded font-bold text-gray-800 uppercase tracking-tighter">{currentProduct.title}</h2>
                        <div className='flex items-center gap-2 mt-3 mb-4'>
                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => <i key={i} className='bi bi-star-fill'></i>)}
                            </div>
                            <span className='text-gray-500 text-sm font-medium'>{currentProduct.review || "(10 Reviews)"}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className='text-3xl font-black text-red-600'>{currentProduct.price}</h3>
                            {currentProduct.lessPrice && (
                                <del className='text-lg text-gray-400 font-medium'>{currentProduct.lessPrice}</del>
                            )}
                        </div>
                        <p className='text-gray-600 leading-relaxed mb-6 text-sm'>
                            {currentProduct.description || "Premium quality product designed for durability and performance. Perfectly fits into your modern lifestyle."}
                        </p>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <button onClick={() => handleAddToCart(currentProduct)} className='flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-black transition-all shadow-md font-bold flex justify-center items-center gap-2 cursor-pointer'> 
                                <i className='bi bi-cart-plus text-xl'></i> Add To Cart
                            </button>
                            <button onClick={() => handleAddToWishlist(currentProduct)} className='px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:border-red-600 hover:text-red-600 transition-all flex justify-center items-center gap-2 cursor-pointer'> 
                                <i className='bi bi-heart text-xl'></i> Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-1/3 space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4 text-sm">
                        <span>Sold By <strong className="text-black">ENT GADGET</strong></span>
                        <Link href='/UI-Components/Shop' className='text-white font-bold bg-red-600 px-4 py-2 rounded-lg hover:bg-black transition-all'>View Store</Link>
                    </div>
                    <div className="space-y-4">
                        <ServiceItem icon="bi-truck" title="Fast Delivery" desc="Lightning-Fast Shipping." />
                        <ServiceItem icon="bi-arrow-return-left" title="Free Returns" desc="30-day risk-free returns." />
                        <ServiceItem icon="bi-shield-check" title="Warranty" desc="1 Year Official Warranty." />
                    </div>
                </div>
            </div>
        </div>

        {/* Specs & Details */}
        <div className='bg-white mt-10 rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className="flex flex-wrap items-center gap-4 p-4 border-b border-gray-100 bg-gray-50">
              <span className='bg-red-600 px-5 py-2 text-white font-bold rounded-full text-sm'>Description</span>
              <div className='flex items-center gap-2 text-green-600 font-bold text-sm px-3'>
                <Image src={satisfactionIcon} alt='icon' width={20} height={20} />
                100% Satisfaction Guaranteed
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                <h2 className='text-2xl font-bold text-gray-800 mb-2 unbounded'>Product Overview</h2>
                <p>{currentProduct.description || "No detailed description available for this product."}</p>
                
                {currentProduct.keyFeatures && currentProduct.keyFeatures.length > 0 && (
                    <>
                        <h3 className="font-bold text-lg mt-4 mb-2">Key Features:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {(currentProduct.keyFeatures as string[]).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </>
                )}
              </div>

              <h2 className='text-2xl font-bold text-gray-800 mb-4 unbounded'>Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <SpecItem label="Product Name" value={currentProduct.title} />
                <SpecItem label="Category" value={currentProduct.ctg || (currentProduct.category as string) || "General"} />
                <SpecItem label="Price" value={currentProduct.price} />
                <SpecItem label="Stock Status" value="In Stock" />
              </div>

              <h2 className='text-2xl font-bold text-gray-800 mt-8 mb-4 unbounded'>Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <h4 className="font-bold mb-1 text-sm">Fast Charging</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase">{currentProduct.fastCharging || "Yes"}</p>
                 </div>
                 <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <h4 className="font-bold mb-1 text-sm">Wireless</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase">{currentProduct.Wireless || "No"}</p>
                 </div>
                 <div className="p-4 border rounded-lg bg-gray-50 text-center">
                    <h4 className="font-bold mb-1 text-sm">Water Resistant</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase">{currentProduct.waterResistant || "No"}</p>
                 </div>
              </div>
            </div>
        </div>

        <div className="mt-10">
            <Deals/>
        </div>
    </div>
  )
}

// --- Helpers ---
const ServiceItem = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
        <div className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <i className={`bi ${icon} text-lg`}></i>
        </div>
        <div>
            <h4 className="font-bold text-sm text-gray-800">{title}</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
        </div>
    </div>
);

const SpecItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex items-center gap-2 text-sm border-b border-gray-200 pb-2">
        <i className="bi bi-check-circle-fill text-red-600 text-xs"></i>
        <span className="font-bold text-gray-700 min-w-[120px]">{label}:</span>
        <span className="text-gray-600 truncate">{value}</span>
    </div>
);

export default ProductDetails;