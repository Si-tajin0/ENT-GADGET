'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getStorageKey } from '@/app/utiles/storageHelper'; 
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaTruck } from 'react-icons/fa';

// ১. টাইপ ইন্টারফেস
interface CartItem {
    _id?: string;        
    Id?: string | number; 
    title: string;
    price: string | number; 
    qty: number;
    image: string;
    [key: string]: unknown;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [mounted, setMounted] = useState(false);
    
    // শিপিং লজিক স্টেট
    const [shippingArea, setShippingArea] = useState<"dhaka" | "outside">("dhaka");

    // ২. শিপিং চার্জ লজিক (চেকআউট পেজের মতো)
    const shippingFee = useMemo(() => {
        return shippingArea === "dhaka" ? 100 : 150;
    }, [shippingArea]);

    const cleanPrice = (price: string | number): number => {
        const p = String(price).replace(/[^0-9.]/g, "");
        return parseFloat(p) || 0;
    };

    const getSafeId = (item: CartItem, index: number): string => {
        return String(item._id || item.Id || `item-${index}`);
    };

    const calculateSubTotal = useCallback((items: CartItem[]) => {
        const total = items.reduce((acc: number, item: CartItem) => {
            const priceNum = cleanPrice(item.price);
            const quantity = item.qty || 1;
            return acc + (priceNum * quantity);
        }, 0);
        setSubTotal(total);
    }, []);

    const loadCartData = useCallback(() => {
        if (typeof window !== 'undefined') {
            const cartKey = getStorageKey('cart'); 
            const storedData = localStorage.getItem(cartKey);
            
            if (storedData) {
                try {
                    const parsedData: unknown = JSON.parse(storedData);
                    if (Array.isArray(parsedData)) {
                        const itemsArray = parsedData as CartItem[];
                        const finalItems = itemsArray.map((item: CartItem) => ({
                            ...item,
                            qty: item.qty > 0 ? item.qty : 1
                        }));
                        setCartItems(finalItems);
                        calculateSubTotal(finalItems);
                    }
                } catch (error: unknown) {
                    console.error("Cart loading error:", error);
                }
            }
        }
    }, [calculateSubTotal]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            loadCartData();
        }, 0);
        
        window.addEventListener("storageUpdate", loadCartData);
        window.addEventListener("authUpdate", loadCartData);
        window.addEventListener("storage", loadCartData);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener("storageUpdate", loadCartData);
            window.removeEventListener("authUpdate", loadCartData);
            window.removeEventListener("storage", loadCartData);
        };
    }, [loadCartData]);

    const updateCart = (updatedItems: CartItem[]) => {
        const cartKey = getStorageKey('cart'); 
        setCartItems(updatedItems);
        localStorage.setItem(cartKey, JSON.stringify(updatedItems));
        calculateSubTotal(updatedItems);
        window.dispatchEvent(new Event("storageUpdate")); 
    };

    const handleRemoveItem = (id: string) => {
        const updatedItems = cartItems.filter((item, index) => getSafeId(item, index) !== id);
        updateCart(updatedItems);
        toast.error("Item removed from cart");
    };

    const incrementQty = (id: string) => {
        const updatedItems = cartItems.map((item, index) => {
            if (getSafeId(item, index) === id) return { ...item, qty: item.qty + 1 };
            return item;
        });
        updateCart(updatedItems);
    };

    const decrementQty = (id: string) => {
        const updatedItems = cartItems.map((item, index) => {
            if (getSafeId(item, index) === id && item.qty > 1) return { ...item, qty: item.qty - 1 };
            return item;
        });
        updateCart(updatedItems);
    };

    if (!mounted) return null;

    const grandTotal = subTotal + shippingFee;

    return (
        <div className="px-[5%] lg:px-[12%] py-12 bg-gray-50 min-h-screen text-gray-800 font-sans">
            {/* হেডার */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-black p-8 rounded-[2.5rem] shadow-2xl border-l-8 border-red-600">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter unbounded leading-none">
                        Shopping <span className="text-red-600">Bag</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">
                        {cartItems.length} Products ready to ship
                    </p>
                </div>
                <Link href="/UI-Components/Shop" className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                   <FaArrowLeft /> Continue Shopping
                </Link>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                    <FaShoppingCart className="text-7xl text-gray-100 mb-6" />
                    <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">Bag is empty</h2>
                    <Link href="/UI-Components/Shop" className="mt-8 px-10 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-200 uppercase text-xs tracking-widest">
                        Browse Store
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* বাম পাশ: প্রোডাক্ট লিস্ট */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 font-black text-[10px] uppercase tracking-widest text-gray-400 border-b">
                                <div className="col-span-6">Product Details</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {cartItems.map((item, index) => {
                                    const currentID = getSafeId(item, index);
                                    const priceNum = cleanPrice(item.price);
                                    
                                    return (
                                        <div key={currentID} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50/50 transition-all duration-300">
                                            <div className="col-span-12 md:col-span-6 flex items-center gap-5">
                                                <div className="w-24 h-24 relative flex-shrink-0 border border-gray-100 rounded-2xl bg-white p-2 flex items-center justify-center shadow-sm">
                                                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 uppercase tracking-tight leading-tight">{item.title}</h3>
                                                    <button onClick={() => handleRemoveItem(currentID)} className="text-red-500 text-[9px] font-black uppercase mt-3 hover:text-black flex items-center gap-1.5 transition-all cursor-pointer">
                                                        <FaTrashAlt /> Remove Item
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-4 md:col-span-2 text-center">
                                                <span className="text-gray-400 text-[10px] md:hidden block font-bold uppercase mb-1">Price</span>
                                                <span className="font-black text-gray-800 text-sm">৳{priceNum.toLocaleString()}</span>
                                            </div>

                                            <div className="col-span-4 md:col-span-2 flex justify-center">
                                                <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                                                    <button onClick={() => decrementQty(currentID)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all cursor-pointer text-gray-500 font-bold">-</button>
                                                    <span className="w-10 text-center font-black text-xs text-gray-800">{item.qty}</span>
                                                    <button onClick={() => incrementQty(currentID)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all cursor-pointer text-gray-500 font-bold">+</button>
                                                </div>
                                            </div>

                                            <div className="col-span-4 md:col-span-2 text-right">
                                                <span className="text-gray-400 text-[10px] md:hidden block font-bold uppercase mb-1">Total</span>
                                                <span className="font-black text-red-600 text-lg tracking-tighter leading-none">
                                                    ৳{(priceNum * item.qty).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ডান পাশ: সামারি (শিপিং লজিকসহ) */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-black mb-6 uppercase tracking-tighter border-b pb-4 text-gray-800">Order Summary</h2>
                            
                            {/* শিপিং ডেস্টিনেশন সিলেকশন */}
                            <div className="mb-8">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-4">
                                    Calculate Shipping
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setShippingArea("dhaka")}
                                        className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${shippingArea === "dhaka" ? "border-red-600 bg-red-50 text-red-600" : "border-gray-100 text-gray-400"}`}
                                    >
                                        Inside Dhaka
                                    </button>
                                    <button 
                                        onClick={() => setShippingArea("outside")}
                                        className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${shippingArea === "outside" ? "border-red-600 bg-red-50 text-red-600" : "border-gray-100 text-gray-400"}`}
                                    >
                                        Outside Dhaka
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-800 font-black">৳{subTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><FaTruck className="text-red-600" /> Delivery</span>
                                    <span className="text-gray-800 font-black">৳{shippingFee}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-dashed pt-6 flex justify-between items-center mb-10">
                                <span className="text-lg font-black uppercase tracking-tighter text-gray-900 leading-none">Grand <br />Total</span>
                                <span className="text-4xl font-black text-red-600 tracking-tighter">
                                    ৳{grandTotal.toLocaleString()}
                                </span>
                            </div>

                            <Link href="/UI-Components/Pages/checkout" className="block text-center w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase text-xs tracking-[0.2em] active:scale-95 duration-300">
                                Proceed to Checkout
                            </Link>
                            
                            <p className="text-[9px] text-center mt-6 text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                {shippingArea === "dhaka" ? "* Delivery within 24-48 hours" : "* Delivery within 3-5 working days"}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Cart;