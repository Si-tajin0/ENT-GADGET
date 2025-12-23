'use client';

import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { getStorageKey } from '@/app/utiles/storageHelper'; 
import { FaCheckCircle, FaDownload, FaShoppingBag, FaArrowLeft, FaTruck, FaTicketAlt } from 'react-icons/fa';

const BKASH_LOGO = "https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon.png";
const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP;

const BANGLADESH_DISTRICTS = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"].sort();

// রেন্ডারের বাইরে আইডি জেনারেটর (এরর ফিক্স)
const generateUniqueOrderId = () => `ENT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
    advancePaid: number;
    total: number;
    paymentMethod: string;
    txnId: string;
    date: string;
    status: string;
}

const Checkout = () => {
    const [isClient, setIsClient] = useState(false);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [finalOrder, setFinalOrder] = useState<OrderData | null>(null);

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("Dhaka");
    const [txnId, setTxnId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"bkash" | "cod">("cod");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [coupon, setCoupon] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClient(true);
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserName(user.fullName || user.name || "");
                setUserEmail(user.email || "");
            }
            setCartItems(JSON.parse(localStorage.getItem(getStorageKey('cart')) || "[]"));
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const subTotal = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const p = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
            return acc + (p * item.qty);
        }, 0);
    }, [cartItems]);

    const deliveryCharge = useMemo(() => (isCouponApplied ? 0 : (selectedDistrict === "Dhaka" ? 100 : 150)), [selectedDistrict, isCouponApplied]);
    const advanceAmount = paymentMethod === "cod" ? 100 : 0;
    const grandTotal = subTotal + deliveryCharge;
    const finalPayable = grandTotal - advanceAmount;

    const applyCoupon = () => {
        if (coupon.toUpperCase() === "ENTFREE") {
            setIsCouponApplied(true);
            toast.success("Coupon Applied! Free Delivery.");
        } else toast.error("Invalid Coupon");
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!txnId) return toast.error("Provide Transaction ID!");

        toast.loading("Placing Order...");

        const orderId = generateUniqueOrderId();
        const newOrder: OrderData = {
            id: orderId,
            customerName: userName,
            customerEmail: userEmail,
            customerPhone: phone,
            address: `${address}, ${selectedDistrict}`,
            items: cartItems,
            subTotal,
            deliveryCharge,
            advancePaid: advanceAmount,
            total: finalPayable,
            paymentMethod: paymentMethod === "cod" ? "COD (Advance Paid)" : "bKash (Full Paid)",
            txnId,
            date: new Date().toLocaleString('en-GB'),
            status: "Pending"
        };

        try {
            await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            const waMsg = `*New Order: ${newOrder.id}*%0A*Customer:* ${newOrder.customerName}%0A*Phone:* ${newOrder.customerPhone}%0A*Final Due:* ৳${newOrder.total}%0A*TxnID:* ${newOrder.txnId}`;
            const allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');
            localStorage.setItem('all_orders', JSON.stringify([newOrder, ...allOrders]));
            localStorage.removeItem(getStorageKey('cart'));
            window.dispatchEvent(new Event("storageUpdate"));

            setFinalOrder(newOrder);
            setIsOrderSuccess(true);
            toast.dismiss();
            toast.success("Order Successful!");
            window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${waMsg}`, '_blank');
        } catch (error) {
            toast.dismiss();
            toast.error("Error occurred!");
        }
    };

    if (!isClient) return null;

    if (isOrderSuccess && finalOrder) {
        return (
            <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen">
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #printable-invoice, #printable-invoice * { visibility: visible; }
                        #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; border: none; padding: 0; margin: 0; }
                        .no-print { display: none !important; }
                        @page { size: auto; margin: 15mm; }
                    }
                `}</style>
                <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
                    <div className="bg-green-600 p-8 text-center text-white no-print">
                        <FaCheckCircle className="text-5xl mx-auto mb-4 animate-bounce" />
                        <h1 className="text-2xl font-black uppercase">Order Placed!</h1>
                        <p className="text-xs font-bold mt-1">ID: {finalOrder.id}</p>
                    </div>

                    <div className="p-10 lg:p-14 bg-white" id="printable-invoice">
                        <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-8">
                            <div><h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter leading-none">ENT GADGET.</h2><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Digital Authorized Store</p></div>
                            <div className="text-right"><h3 className="font-black uppercase text-gray-800 text-xl tracking-tighter">Official Invoice</h3><p className="text-[10px] font-bold text-gray-400">{finalOrder.date}</p></div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10 text-[11px] font-bold uppercase tracking-tight">
                            <div className="space-y-1">
                                <h4 className="text-gray-300 tracking-widest">Billed To</h4>
                                <p className="text-gray-800 text-sm font-black">{finalOrder.customerName}</p>
                                <p className="text-gray-500">{finalOrder.customerPhone}</p>
                                <p className="text-gray-500">{finalOrder.address}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <h4 className="text-gray-300 tracking-widest">Details</h4>
                                <p className="text-gray-800 font-black">{finalOrder.paymentMethod}</p>
                                <p className="text-red-600 font-black tracking-widest">TxnID: {finalOrder.txnId}</p>
                                <p className="text-gray-400">Order: {finalOrder.id}</p>
                            </div>
                        </div>

                        <table className="w-full mb-8 text-[11px] uppercase font-bold border-collapse">
                            <thead className="border-b-2 border-black">
                                <tr className="text-gray-400 text-left">
                                    <th className="pb-2">Description</th>
                                    <th className="pb-2 text-center">Qty</th>
                                    <th className="pb-2 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finalOrder.items.map((item, i) => {
                                    const p = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                                    return (
                                        <tr key={i} className="border-b border-gray-100">
                                            <td className="py-3 text-gray-700 max-w-[200px] truncate">{item.title}</td>
                                            <td className="py-3 text-center">{item.qty}</td>
                                            <td className="py-3 text-right">৳{(p * item.qty).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="flex justify-end">
                            <div className="w-64 space-y-2 text-[11px] font-bold uppercase">
                                <div className="flex justify-between text-gray-400"><span>Subtotal:</span><span>৳{finalOrder.subTotal.toLocaleString()}</span></div>
                                <div className="flex justify-between text-gray-400"><span>Delivery Charge:</span><span>৳{finalOrder.deliveryCharge}</span></div>
                                {finalOrder.advancePaid > 0 && <div className="flex justify-between text-green-600 italic"><span>COD Advance Paid:</span><span>- ৳{finalOrder.advancePaid}</span></div>}
                                <div className="flex justify-between text-xl font-black text-red-600 border-t-2 border-black pt-4 tracking-tighter"><span>Total Due:</span><span>৳{finalOrder.total.toLocaleString()}</span></div>
                            </div>
                        </div>
                        <p className="text-center text-[9px] mt-24 text-gray-300 font-bold uppercase tracking-[0.5em] print:block hidden border-t pt-8">Thanks for shopping with ENT GADGET</p>
                    </div>

                    <div className="bg-gray-50 p-8 flex gap-4 justify-center no-print">
                        <button onClick={() => window.print()} className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-600 transition-all"><FaDownload /> Save / Print PDF</button>
                        <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 hover:bg-black transition-all">Back Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen text-gray-800 font-sans">
             <div className="mb-10 flex items-center justify-between">
                <Link href="/UI-Components/Pages/cart" className="flex items-center gap-2 font-black uppercase text-[10px] text-gray-400 hover:text-red-600 transition-all tracking-widest"><FaArrowLeft /> Edit Cart Items</Link>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Checkout.</h1>
             </div>
             <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">
                 <div className="w-full lg:w-[65%] space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black mb-6 uppercase border-b pb-4 tracking-tighter text-red-600">1. Shipping Info</h2>
                        <div className="grid gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} required placeholder="Full Name" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                                <input type="email" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} required placeholder="Email Address" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} required placeholder="Phone Number" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold" />
                                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold">
                                    {BANGLADESH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <textarea value={address} onChange={(e)=>setAddress(e.target.value)} required placeholder="House#, Road#, Area Address" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold h-20"></textarea>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black mb-6 uppercase border-b pb-4 tracking-tighter text-red-600">2. Payment Method</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'cod' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 text-gray-400'}`}><i className="bi bi-cash-stack text-3xl"></i><span className="font-black text-xs uppercase tracking-widest">Cash on Delivery</span></button>
                            <button type="button" onClick={() => setPaymentMethod('bkash')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-gray-100 text-gray-400'}`}><Image src={BKASH_LOGO} alt="bkash" width={40} height={40} unoptimized /><span className="font-black text-xs uppercase tracking-widest text-pink-600">bKash (Full Pay)</span></button>
                        </div>
                        <div className={`p-6 rounded-3xl border-2 ${paymentMethod === 'cod' ? 'bg-orange-50 border-orange-200' : 'bg-pink-50 border-pink-200'}`}>
                            <p className="font-black text-xs uppercase mb-3 tracking-widest text-gray-800">{paymentMethod === 'cod' ? 'COD Advance Payment' : 'Full Payment Instruction'}</p>
                            <p className="text-sm font-bold opacity-70 mb-5 leading-tight">{paymentMethod === 'cod' ? 'Send 100৳ advance to confirm order. It will be subtracted from final bill.' : `Send full payment ৳${finalPayable.toLocaleString()} to complete.`}</p>
                            <div className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 flex justify-between items-center mb-6 shadow-sm">
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Send Money (Personal)</p><p className="text-xl font-black text-gray-800 tracking-widest">{ADMIN_WHATSAPP}</p></div>
                                <Image src={BKASH_LOGO} alt="logo" width={45} height={45} unoptimized />
                            </div>
                            <input type="text" value={txnId} onChange={(e)=>setTxnId(e.target.value)} required placeholder="Enter Transaction ID (TxnID)" className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 font-black tracking-widest uppercase text-gray-800" />
                        </div>
                    </div>
                 </div>
                 <div className="w-full lg:w-[35%] space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h2 className="text-xs font-black uppercase mb-4 flex items-center gap-2 text-red-600 tracking-widest"><FaTicketAlt /> Apply Coupon</h2>
                        <div className="flex gap-2">
                            <input type="text" placeholder="ENTFREE" value={coupon} onChange={(e)=>setCoupon(e.target.value)} className="flex-1 p-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-1 focus:ring-red-600 font-bold uppercase text-sm" />
                            <button type="button" onClick={applyCoupon} className="bg-black text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase transition-all hover:bg-red-600">Apply</button>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-black mb-8 uppercase tracking-tighter border-b pb-4 leading-none">Summary</h2>
                        <div className="max-h-60 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center group">
                                    <div className="relative w-14 h-14 border rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden p-1 border-gray-100 shadow-sm"><img src={item.image} alt={item.title} className="w-full h-full object-contain" /><span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{item.qty}</span></div>
                                    <div className="flex-1 overflow-hidden"><p className="text-[11px] font-black text-gray-400 uppercase line-clamp-1">{item.title}</p><p className="text-sm font-black text-gray-800 mt-1 tracking-tighter">৳{String(item.price).replace(/[^0-9.]/g, "")}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-100 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                            <div className="flex justify-between"><span>Subtotal:</span><span className="text-gray-800 font-black">৳{subTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Delivery:</span><span className={isCouponApplied ? "text-green-600" : "text-gray-800"}>{isCouponApplied ? "FREE" : `৳${deliveryCharge}`}</span></div>
                            {paymentMethod === "cod" && <div className="flex justify-between text-orange-600 italic tracking-widest"><span>Advance:</span><span>- ৳100</span></div>}
                            <div className="border-t border-dashed pt-5 flex justify-between items-center text-red-600 font-black">
                                <span className="text-xs">Final Due</span>
                                <span className="text-4xl tracking-tighter leading-none">৳{finalPayable.toLocaleString()}</span>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-5 mt-10 bg-red-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase text-xs tracking-widest active:scale-95 duration-300">Confirm Order Now</button>
                    </div>
                 </div>
             </form>
        </div>
    );
};

export default Checkout;