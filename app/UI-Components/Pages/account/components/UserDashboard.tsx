'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { FaUser, FaBox, FaTruck, FaFileInvoice, FaSignOutAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

// --- ১. ইন্টারফেসসমূহ (any এরর ফিক্স করার জন্য) ---
interface OrderItem {
    id: string | number;
    title: string;
    price: string;
    image: string;
}

interface Order {
    id: string;
    customerEmail: string;
    date: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
    paymentMethod: string;
    items?: OrderItem[];
}

interface User {
    name?: string;
    email: string;
}

interface Props {
    user: User | null;
    handleLogout: () => void;
}

// হেল্পার কম্পোনেন্ট টাইপ
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
    const [activeTab, setActiveTab] = useState('dashboard');
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [mounted, setMounted] = useState(false);

    const displayName = user?.name || "User";

    // ২. মাউন্ট এবং ডাটা লোড লজিক (Cascading Render ফিক্স)
    useEffect(() => {
        // ফিক্স: সরাসরি সেট না করে একটি ছোট ডিলে বা নেক্সট টিক-এ সেট করা
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        
        const fetchOrders = () => {
            if (typeof window !== 'undefined') {
                try {
                    const allOrders: Order[] = JSON.parse(localStorage.getItem('all_orders') || '[]');
                    // ইমেইল চেক করে ফিল্টার করা
                    if (user?.email) {
                        const filtered = allOrders.filter(order => order.customerEmail === user.email);
                        setMyOrders(filtered);
                    }
                } catch (error) {
                    console.error("Error parsing orders:", error);
                }
            }
        };

        fetchOrders();

        // ক্লিনআপ ফাংশন
        return () => clearTimeout(timer);
    }, [user?.email]);

    // ৩. স্ট্যাটাস কাউন্ট (Memoized - পারফরম্যান্সের জন্য)
    const stats = useMemo(() => ({
        total: myOrders.length,
        delivered: myOrders.filter(o => o.status === 'Delivered').length,
        pending: myOrders.filter(o => o.status === 'Pending').length
    }), [myOrders]);

    if (!mounted) return null;

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black bg-black text-white mb-8 unbounded p-6 rounded-2xl shadow-lg flex justify-between items-center">
                My Account
                <span className="text-sm font-normal bg-red-600 px-4 py-1 rounded-full uppercase tracking-widest">{activeTab}</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* === SIDEBAR === */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 sticky top-24">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                            <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold uppercase shadow-md">
                                {displayName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Welcome</p>
                                <h3 className="font-bold text-gray-800 capitalize leading-tight">{displayName}</h3>
                            </div>
                        </div>
                        <nav className="flex flex-col p-2">
                            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<FaUser />} label="Dashboard" />
                            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<FaBox />} label="Order History" badge={myOrders.length} />
                            <TabButton active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} icon={<FaTruck />} label="Track Order" />
                            <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer mt-4">
                                <FaSignOutAlt /> Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* === CONTENT AREA === */}
                <div className="w-full lg:w-3/4 bg-white p-6 lg:p-10 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                    
                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 className="text-2xl font-black mb-6 unbounded uppercase text-gray-800">Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <StatusCard color="bg-blue-600" label="Total Orders" value={stats.total} />
                                <StatusCard color="bg-green-600" label="Delivered" value={stats.delivered} />
                                <StatusCard color="bg-yellow-500" label="Pending" value={stats.pending} />
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    From your account dashboard you can view your <span className="font-bold text-black">recent orders</span>, 
                                    manage your <span className="font-bold text-black">shipping addresses</span>, and edit your 
                                    <span className="font-bold text-black"> account details</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-black mb-6 unbounded uppercase">Order History</h2>
                            {myOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b-2 border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                                                <th className="pb-4">Order ID</th>
                                                <th className="pb-4">Date</th>
                                                <th className="pb-4">Total</th>
                                                <th className="pb-4">Status</th>
                                                <th className="pb-4 text-right">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                                    <td className="py-4 font-bold text-gray-800">{order.id}</td>
                                                    <td className="py-4 text-gray-500">{order.date}</td>
                                                    <td className="py-4 font-black text-red-600">৳{order.total.toLocaleString()}</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <button 
                                                            onClick={() => { setSelectedOrder(order); setActiveTab('invoice'); }}
                                                            className="text-red-600 hover:text-black transition cursor-pointer p-2"
                                                        >
                                                            <FaFileInvoice className="text-xl" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'tracking' && (
                        <div className="max-w-xl mx-auto text-center py-10">
                            <FaTruck className="text-6xl text-gray-100 mx-auto mb-4" />
                            <h2 className="text-2xl font-black mb-2 unbounded uppercase">Track Order</h2>
                            <p className="text-gray-500 mb-8 text-sm">Enter your Order ID to see real-time status.</p>
                            <div className="flex gap-2">
                                <input type="text" placeholder="e.g. #ORD-12345" className="flex-1 p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 font-bold text-sm" />
                                <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 transition-all cursor-pointer text-sm uppercase">Track</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'invoice' && selectedOrder && (
                        <div className="bg-white">
                            <button onClick={() => setActiveTab('orders')} className="mb-6 text-xs font-bold text-gray-400 hover:text-red-600 flex items-center gap-2 cursor-pointer uppercase tracking-widest">
                                ← Back to Orders
                            </button>
                            <div className="border-2 border-gray-100 rounded-[2rem] p-8 lg:p-12 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16"></div>
                                
                                <div className="flex justify-between items-start mb-10 relative">
                                    <div>
                                        <h1 className="text-4xl font-black uppercase unbounded leading-none">Invoice</h1>
                                        <p className="text-gray-400 font-bold text-[10px] mt-2 tracking-widest uppercase">ID: {selectedOrder.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="font-black text-red-600 uppercase text-xl tracking-tighter">ENT Gadget.</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Official Store</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-sm border-t border-gray-50 pt-8">
                                    <div>
                                        <h4 className="font-black text-gray-300 uppercase text-[10px] mb-3 tracking-widest">Billed To:</h4>
                                        <p className="font-black text-lg text-gray-800">{displayName}</p>
                                        <p className="text-gray-500 font-medium">{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div className="md:text-right">
                                        <h4 className="font-black text-gray-300 uppercase text-[10px] mb-3 tracking-widest">Order Details:</h4>
                                        <p className="text-gray-500">Date: <span className="text-black font-black">{selectedOrder.date}</span></p>
                                        <p className="text-gray-500">Method: <span className="text-black font-black uppercase">{selectedOrder.paymentMethod}</span></p>
                                    </div>
                                </div>

                                <div className="border-t border-b border-gray-100 py-4 mb-6">
                                    <div className="flex justify-between font-black text-gray-400 uppercase text-[10px] tracking-widest">
                                        <span>Description</span>
                                        <span>Amount</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-gray-600 font-medium">Subtotal Amount</span>
                                    <span className="font-black text-gray-800">৳{selectedOrder.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-gray-600 font-medium">Shipping Fee</span>
                                    <span className="font-black text-gray-800">৳0</span>
                                </div>

                                <div className="flex justify-between items-center py-6 border-t border-gray-100 mt-6">
                                    <span className="text-xl font-black uppercase tracking-tighter">Total Payable</span>
                                    <span className="text-3xl font-black text-red-600 tracking-tighter">৳{selectedOrder.total.toLocaleString()}</span>
                                </div>

                                <button onClick={() => window.print()} className="mt-8 w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-red-600 transition-all cursor-pointer uppercase text-xs tracking-widest shadow-lg">
                                    Download / Print Invoice
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- হেল্পার কম্পোনেন্টসমূহ (টাইপসহ) ---

const TabButton = ({ active, onClick, icon, label, badge }: TabButtonProps) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-3 p-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer mb-1
        ${active ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'text-gray-500 hover:bg-gray-50'}`}
    >
        <span className="text-sm">{icon}</span> {label}
        {badge !== undefined && (
            <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-white text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                {badge}
            </span>
        )}
    </button>
);

const StatusCard = ({ color, label, value }: StatusCardProps) => (
    <div className={`${color} p-6 rounded-2xl text-white shadow-xl shadow-gray-200/50`}>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</p>
        <h3 className="text-4xl font-black mt-2 tracking-tighter">{value}</h3>
    </div>
);

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-600';
        case 'Pending': return 'bg-yellow-100 text-yellow-600';
        case 'Processing': return 'bg-blue-100 text-blue-600';
        case 'Cancelled': return 'bg-red-100 text-red-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}

export default UserDashboard;