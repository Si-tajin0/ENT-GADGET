'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaUser, FaBox, FaTruck, FaFileInvoice, FaSignOutAlt, FaCheckCircle, FaClock, FaTimesCircle, FaShippingFast } from 'react-icons/fa';

// --- ১. ইন্টারফেসসমূহ ---
interface OrderItem {
    _id?: string;
    Id?: string | number;
    title: string;
    price: string | number;
    qty: number;
    image: string;
}

interface Order {
    _id: string;
    id: string; // ENT-123456
    customerEmail: string;
    date: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentMethod: string;
    items: OrderItem[];
    txnId?: string;
}

interface User {
    name?: string;
    email: string;
}

interface Props {
    user: User | null;
    handleLogout: () => void;
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

interface StatusCardProps {
    color: string;
    label: string;
    value: number;
}

const UserDashboard = ({ user, handleLogout }: Props) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'tracking' | 'invoice'>('dashboard');
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    const displayName = user?.name || "User";

    // ২. ডাটাবেস থেকে ইউজারের অর্ডার ফেচ করা
    const fetchMyOrders = useCallback(async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            const res = await fetch('/api/order');
            if (res.ok) {
                const allOrders: Order[] = await res.json();
                // বর্তমান ইউজারের ইমেইল দিয়ে ফিল্টার
                const filtered = allOrders.filter(order => order.customerEmail === user.email);
                setMyOrders(filtered);
            }
        } catch (error: unknown) {
            console.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            fetchMyOrders();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchMyOrders]);

    // ৩. স্ট্যাটাস কাউন্ট (Memoized)
    const stats = useMemo(() => ({
        total: myOrders.length,
        delivered: myOrders.filter(o => o.status === 'Delivered').length,
        processing: myOrders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length
    }), [myOrders]);

    if (!mounted) return null;

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen text-gray-800">
            {/* Header */}
            <h1 className="text-3xl font-black bg-black text-white mb-10 p-6 rounded-[2rem] shadow-xl flex justify-between items-center uppercase tracking-tighter">
                User Panel
                <span className="text-xs font-normal bg-red-600 px-4 py-1 rounded-full tracking-widest">{activeTab}</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* === SIDEBAR === */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 sticky top-24">
                        <div className="p-8 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                            <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black uppercase shadow-lg shadow-red-100">
                                {displayName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Account of</p>
                                <h3 className="font-black text-gray-800 capitalize leading-none text-lg">{displayName}</h3>
                            </div>
                        </div>
                        <nav className="flex flex-col p-4 space-y-1">
                            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<FaUser />} label="Overview" />
                            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<FaBox />} label="My Orders" badge={myOrders.length} />
                            <TabButton active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} icon={<FaTruck />} label="Tracking" />
                            <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer mt-4">
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                {/* === CONTENT AREA === */}
                <div className="w-full lg:w-3/4 bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[550px]">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Dashboard Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <StatusCard color="bg-black" label="Total Orders" value={stats.total} />
                                <StatusCard color="bg-red-600" label="On the Way" value={stats.processing} />
                                <StatusCard color="bg-green-600" label="Delivered" value={stats.delivered} />
                            </div>
                            <div className="bg-gray-50 p-8 rounded-[2rem] border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Hello <span className="text-black font-black">{displayName}</span>, here you can manage your latest orders and track their delivery status in real-time. If you have any issues, please contact our support.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ORDER HISTORY TAB */}
                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Order History</h2>
                            {loading ? (
                                <p className="text-center py-20 font-bold text-gray-300 animate-pulse">Syncing with server...</p>
                            ) : myOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b-2 border-gray-50">
                                                <th className="pb-4">Order ID</th>
                                                <th className="pb-4">Date</th>
                                                <th className="pb-4">Amount</th>
                                                <th className="pb-4">Status</th>
                                                <th className="pb-4 text-right">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {myOrders.map((order) => (
                                                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-all group">
                                                    <td className="py-5 font-black text-gray-800">{order.id}</td>
                                                    <td className="py-5 font-bold text-gray-400">{order.date}</td>
                                                    <td className="py-5 font-black text-red-600">৳{order.total.toLocaleString()}</td>
                                                    <td className="py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${getStatusStyle(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <button 
                                                            onClick={() => { setSelectedOrder(order); setActiveTab('invoice'); }}
                                                            className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer ml-auto"
                                                        >
                                                            <FaFileInvoice />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <FaBox className="text-5xl text-gray-100 mx-auto mb-4" />
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No orders found.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* REAL-TIME TRACKING TAB */}
                    {activeTab === 'tracking' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-black mb-10 uppercase tracking-tighter">Live Tracking</h2>
                            {myOrders.length > 0 ? (
                                <div className="space-y-12">
                                    {myOrders.slice(0, 2).map(order => (
                                        <div key={order._id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative overflow-hidden">
                                            <div className="flex justify-between items-center mb-8">
                                                <span className="font-black text-xs uppercase tracking-widest text-gray-400">Tracking: {order.id}</span>
                                                <span className="font-black text-red-600 uppercase text-[10px]">{order.status}</span>
                                            </div>
                                            
                                            {/* Tracking Visual Steps */}
                                            <div className="flex justify-between relative z-10">
                                                <TrackStep icon={<FaClock />} label="Pending" active={true} completed={['Processing', 'Shipped', 'Delivered'].includes(order.status) || order.status === 'Pending'} />
                                                <TrackStep icon={<FaBox />} label="Packing" active={['Processing', 'Shipped', 'Delivered'].includes(order.status)} completed={['Shipped', 'Delivered'].includes(order.status)} />
                                                <TrackStep icon={<FaShippingFast />} label="Shipped" active={['Shipped', 'Delivered'].includes(order.status)} completed={order.status === 'Delivered'} />
                                                <TrackStep icon={<FaCheckCircle />} label="Arrived" active={order.status === 'Delivered'} completed={order.status === 'Delivered'} />
                                            </div>
                                            
                                            {/* Progress Line */}
                                            <div className="absolute top-[108px] left-[15%] right-[15%] h-1 bg-gray-200 -z-0">
                                                <div className={`h-full bg-red-600 transition-all duration-1000 ${order.status === 'Pending' ? 'w-0' : order.status === 'Processing' ? 'w-1/3' : order.status === 'Shipped' ? 'w-2/3' : order.status === 'Delivered' ? 'w-full' : 'w-0'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-20 text-gray-300 font-bold uppercase text-xs">Place an order to track.</p>
                            )}
                        </div>
                    )}

                    {/* INVOICE VIEW */}
                    {activeTab === 'invoice' && selectedOrder && (
                        <div className="animate-in zoom-in duration-300">
                            <button onClick={() => setActiveTab('orders')} className="mb-6 text-[10px] font-black text-gray-400 hover:text-red-600 flex items-center gap-2 cursor-pointer uppercase tracking-widest">
                                ← Back to History
                            </button>
                            <div className="border-2 border-gray-100 rounded-[2.5rem] p-8 lg:p-12 shadow-sm relative overflow-hidden bg-white">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16"></div>
                                
                                <div className="flex justify-between items-start mb-10 relative">
                                    <div>
                                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Invoice</h1>
                                        <p className="text-gray-400 font-black text-[10px] mt-2 tracking-widest uppercase">No: {selectedOrder.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="font-black text-red-600 uppercase text-xl tracking-tighter">ENT Gadget.</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Official Store</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-sm border-t border-gray-50 pt-8">
                                    <div>
                                        <h4 className="font-black text-gray-300 uppercase text-[10px] mb-3 tracking-widest">Billed To:</h4>
                                        <p className="font-black text-lg text-gray-800">{displayName}</p>
                                        <p className="text-gray-500 font-bold">{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div className="md:text-right">
                                        <h4 className="font-black text-gray-300 uppercase text-[10px] mb-3 tracking-widest">Order Summary:</h4>
                                        <p className="text-gray-500 font-bold">Date: <span className="text-black font-black">{selectedOrder.date}</span></p>
                                        <p className="text-gray-500 font-bold">Method: <span className="text-black font-black uppercase">{selectedOrder.paymentMethod}</span></p>
                                    </div>
                                </div>

                                <div className="border-t border-b border-gray-100 py-4 mb-6">
                                    <div className="flex justify-between font-black text-gray-400 uppercase text-[10px] tracking-widest">
                                        <span>Product Description</span>
                                        <span>Subtotal</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-6">
                                    <span className="text-xl font-black uppercase tracking-tighter">Total Payable</span>
                                    <span className="text-3xl font-black text-red-600 tracking-tighter">৳{selectedOrder.total.toLocaleString()}</span>
                                </div>

                                <button onClick={() => window.print()} className="mt-8 w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-red-600 transition-all cursor-pointer uppercase text-xs tracking-widest shadow-xl shadow-gray-200">
                                    Print Official Invoice
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- হেল্পার কম্পোনেন্টসমূহ ---

const TabButton = ({ active, onClick, icon, label, badge }: TabButtonProps) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer mb-1
        ${active ? 'bg-red-600 text-white shadow-xl shadow-red-100' : 'text-gray-400 hover:bg-gray-50'}`}
    >
        <span className="text-base">{icon}</span> {label}
        {badge !== undefined && (
            <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-white text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                {badge}
            </span>
        )}
    </button>
);

const StatusCard = ({ color, label, value }: StatusCardProps) => (
    <div className={`${color} p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group`}>
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
        <h3 className="text-5xl font-black mt-2 tracking-tighter">{value}</h3>
    </div>
);

const TrackStep = ({ icon, label, active, completed }: { icon: React.ReactNode, label: string, active: boolean, completed: boolean }) => (
    <div className="flex flex-col items-center gap-2 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 ${completed ? 'bg-green-500 text-white shadow-lg shadow-green-100' : active ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-white text-gray-200 border-2 border-gray-100'}`}>
            {completed ? <FaCheckCircle /> : icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-black' : 'text-gray-300'}`}>{label}</span>
    </div>
);

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-600';
        case 'Shipped': return 'bg-purple-100 text-purple-600';
        case 'Pending': return 'bg-yellow-100 text-yellow-600';
        case 'Processing': return 'bg-blue-100 text-blue-600';
        case 'Cancelled': return 'bg-red-100 text-red-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}

export default UserDashboard;