'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { getStorageKey } from '@/app/utiles/storageHelper'; 
import { FaCheckCircle, FaDownload, FaShoppingBag, FaArrowLeft, FaTruck } from 'react-icons/fa';

const BKASH_LOGO = "https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon.png";
const PERSONAL_BKASH_NUMBER = "01670424702"; 

const BANGLADESH_DISTRICTS = [
    "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail",
    "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
    "Bogra", "Joypurhat", "Naogaon", "Natore", "Nawabganj", "Pabna", "Rajshahi", "Sirajganj",
    "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon",
    "Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",
    "Bandarban", "Brahmanbaria", "Chandpur", "Chittagong", "Comilla", "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati",
    "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet",
    "Jamalpur", "Mymensingh", "Netrokona", "Sherpur"
].sort();

interface CartItem {
    _id?: string;
    Id?: string | number;
    title: string;
    price: string | number; 
    qty: number;
    image: string;
}

interface OrderData {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    items: CartItem[];
    subTotal: number;
    deliveryCharge: number;
    total: number;
    paymentMethod: string;
    txnId: string;
    date: string;
    status: string;
}

// ইউনিক অর্ডার আইডি জেনারেটর (Impure function fix)
const generateOrderId = () => `ENT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const Checkout = () => {
    const [isClient, setIsClient] = useState(false);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [finalOrder, setFinalOrder] = useState<OrderData | null>(null);

    // Form States
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("Dhaka");
    const [txnId, setTxnId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"bkash" | "cod">("cod");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClient(true);
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserName(user.fullName || user.name || "");
                setUserEmail(user.email || "");
            }
            const cartKey = getStorageKey('cart'); 
            const savedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
            setCartItems(savedCart);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // শিপিং চার্জ লজিক: ঢাকা ১০০, ঢাকার বাইরে ১৫০
    const deliveryCharge = selectedDistrict === "Dhaka" ? 100 : 150;

    const subTotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
        return acc + (price * item.qty);
    }, 0);
    const grandTotal = subTotal + deliveryCharge;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!txnId) return toast.error("Please provide Transaction ID!");

        const orderId = generateOrderId();

        const newOrder: OrderData = {
            id: orderId,
            customerName: userName,
            customerEmail: userEmail,
            customerPhone: phone,
            address: `${address}, ${selectedDistrict}`,
            items: cartItems,
            subTotal: subTotal,
            deliveryCharge: deliveryCharge,
            total: grandTotal,
            paymentMethod: paymentMethod === "cod" ? "Cash On Delivery (Advance Paid)" : "bKash (Full Paid)",
            txnId: txnId,
            date: new Date().toLocaleString('en-GB'),
            status: "Pending"
        };

        // ৫. Admin Sync
        const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');
        localStorage.setItem('all_orders', JSON.stringify([newOrder, ...allOrders]));

        // কার্ট ক্লিয়ার
        const cartKey = getStorageKey('cart');
        localStorage.removeItem(cartKey);
        window.dispatchEvent(new Event("storageUpdate"));

        setFinalOrder(newOrder);
        setIsOrderSuccess(true);
        toast.success("Order Placed!");
    };

    if (!isClient) return null;

    // --- সাকসেস ভিউ এবং ইনভয়েস ---
    if (isOrderSuccess && finalOrder) {
        return (
            <div className="px-[5%] lg:px-[12%] py-10 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    
                    {/* Success Header (Print-এ হাইড থাকবে) */}
                    <div className="bg-green-600 p-8 text-center text-white print:hidden">
                        <FaCheckCircle className="text-6xl mx-auto mb-4 animate-bounce" />
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Order Placed Successfully!</h1>
                        <p className="font-bold opacity-80 mt-2 tracking-widest text-xs uppercase">Confirmation sent to your dashboard</p>
                    </div>

                    {/* Invoice Area */}
                    <div className="p-8 lg:p-12" id="invoice">
                        <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter">ENT GADGET.</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Digital Authorized Dealer Store</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-black uppercase text-gray-800 text-xl">Official Invoice</h3>
                                <p className="text-sm font-bold text-gray-400">Date: {finalOrder.date}</p>
                                <p className="text-sm font-bold text-gray-400">Order ID: {finalOrder.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-sm">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-widest">Billed To:</h4>
                                <p className="font-black text-lg text-gray-800 uppercase">{finalOrder.customerName}</p>
                                <p className="font-bold text-gray-500">{finalOrder.customerPhone}</p>
                                <p className="font-bold text-gray-500">{finalOrder.address}</p>
                            </div>
                            <div className="md:text-right">
                                <h4 className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-widest">Payment Summary:</h4>
                                <p className="font-black text-gray-800 uppercase">{finalOrder.paymentMethod}</p>
                                <p className="text-red-600 font-black uppercase text-xs mt-1">TxnID: {finalOrder.txnId}</p>
                                <p className="mt-3 inline-block bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Current Status: {finalOrder.status}</p>
                            </div>
                        </div>

                        <table className="w-full mb-8">
                            <thead>
                                <tr className="border-b-2 border-black text-[10px] font-black uppercase text-black">
                                    <th className="text-left pb-3">Item Description</th>
                                    <th className="text-center pb-3">Qty</th>
                                    <th className="text-right pb-3">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {finalOrder.items.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="py-4 font-bold text-gray-700 uppercase text-xs">{item.title}</td>
                                        <td className="py-4 text-center font-bold text-gray-500">{item.qty}</td>
                                        <td className="py-4 text-right font-black">৳ {String(item.price).replace(/[^0-9.]/g, "")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end pt-4">
                            <div className="w-full md:w-72 space-y-3">
                                <div className="flex justify-between text-sm font-bold text-gray-400"><span>Cart Subtotal:</span><span>৳ {finalOrder.subTotal.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm font-bold text-gray-400"><span>Shipping Charge:</span><span>৳ {finalOrder.deliveryCharge}</span></div>
                                <div className="flex justify-between text-2xl font-black text-red-600 border-t-2 border-black pt-4 tracking-tighter">
                                    <span>Grand Total:</span>
                                    <span>৳ {finalOrder.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer (Print-এ দেখা যাবে) */}
                        <div className="mt-20 border-t pt-8 text-center">
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Thank you for shopping with ENT Gadget</p>
                        </div>
                    </div>

                    {/* Action Buttons (Print-এ হাইড থাকবে) */}
                    <div className="bg-gray-50 p-8 flex flex-col md:flex-row gap-4 justify-center print:hidden">
                        <button onClick={() => window.print()} className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl">
                            <FaDownload /> Download / Print PDF
                        </button>
                        <Link href="/UI-Components/Pages/account" className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl">
                            <FaTruck /> Track My Order
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen text-gray-800">
             <div className="mb-10 flex items-center justify-between">
                <Link href="/UI-Components/Pages/cart" className="flex items-center gap-2 font-black uppercase text-[10px] text-gray-400 hover:text-red-600 transition-all tracking-widest"><FaArrowLeft /> Edit Cart Items</Link>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Checkout.</h1>
             </div>
             
             <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">
                 <div className="w-full lg:w-[65%] space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black mb-6 uppercase border-b pb-4 tracking-tighter">1. Shipping Destination</h2>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Full Name</label>
                                    <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} required className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Email Address</label>
                                    <input type="email" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} required className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Phone Number</label>
                                    <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} required placeholder="01XXXXXXXXX" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Select District</label>
                                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold cursor-pointer">
                                        {BANGLADESH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Full Delivery Address</label>
                                <textarea value={address} onChange={(e)=>setAddress(e.target.value)} required placeholder="House#, Road#, Area" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold h-24 resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black mb-6 uppercase border-b pb-4 tracking-tighter">2. Payment Verification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'cod' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 text-gray-400'}`}>
                                <i className="bi bi-cash-stack text-3xl"></i>
                                <span className="font-black text-xs uppercase tracking-tighter">Cash on Delivery</span>
                            </button>
                            <button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-100 text-gray-400'}`}>
                                <Image src={BKASH_LOGO} alt="bkash" width={40} height={40} unoptimized />
                                <span className="font-black text-xs uppercase tracking-tighter">Full bKash Pay</span>
                            </button>
                        </div>

                        <div className={`p-6 rounded-3xl border-2 ${paymentMethod === 'cod' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-pink-50 border-pink-200 text-pink-800'}`}>
                            <p className="font-black text-[10px] uppercase mb-2 tracking-widest">{paymentMethod === 'cod' ? 'COD Notice' : 'bKash Instruction'}</p>
                            <p className="text-sm font-bold opacity-80 mb-5 leading-tight">{paymentMethod === 'cod' ? 'To confirm COD order, please send 100৳ advance.' : `Send full ৳${grandTotal.toLocaleString()} to complete payment.`}</p>
                            <div className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 flex justify-between items-center mb-6 shadow-sm">
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Send Money (Personal)</p><p className="text-xl font-black text-gray-800 tracking-widest">{PERSONAL_BKASH_NUMBER}</p></div>
                                <Image src={BKASH_LOGO} alt="logo" width={45} height={45} unoptimized />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Enter TxnID</label>
                                <input type="text" value={txnId} onChange={(e)=>setTxnId(e.target.value)} required placeholder="8N7X6W5V" className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 font-black tracking-widest uppercase text-gray-800" />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* SIDEBAR SUMMARY */}
                 <div className="w-full lg:w-[35%]">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-black mb-8 uppercase tracking-tighter border-b pb-4">Order Summary</h2>
                        <div className="max-h-64 overflow-y-auto mb-6 pr-2 space-y-5 custom-scrollbar">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-16 border rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden p-2 border-gray-100">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{item.qty}</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[11px] font-black text-gray-400 uppercase line-clamp-1 leading-tight tracking-tight">{item.title}</p>
                                        <p className="text-sm font-black text-gray-800 mt-1 tracking-tighter">৳ {String(item.price).replace(/[^0-9.]/g, "")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-50 font-bold text-gray-400">
                            <div className="flex justify-between text-xs uppercase tracking-widest"><span>Subtotal:</span><span className="text-gray-800">৳ {subTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-xs uppercase tracking-widest"><span>Delivery Charge:</span><span className="text-gray-800 font-black">৳ {deliveryCharge}</span></div>
                            <div className="border-t border-dashed pt-5 flex justify-between items-center text-red-600 font-black">
                                <span className="uppercase text-xs tracking-widest">Total Payable</span>
                                <span className="text-4xl tracking-tighter">৳ {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-5 mt-10 bg-red-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase text-xs tracking-widest active:scale-95 duration-300">Place Order Now</button>
                    </div>
                 </div>
             </form>
        </div>
    );
};

export default Checkout;