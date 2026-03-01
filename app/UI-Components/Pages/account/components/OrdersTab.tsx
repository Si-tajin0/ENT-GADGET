'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSync } from 'react-icons/fa';

interface Order {
    _id: string;
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    total: number;
    paymentMethod: string;
    txnId: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: string;
}

const OrdersTab = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // ডাটা ফেচ করার মূল ফাংশন
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/order');
            if (res.ok) {
                const data: Order[] = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Order load error");
        } finally {
            setLoading(false);
        }
    };

    // কম্পোনেন্ট মাউন্ট হওয়ার সময় একবারই কল হবে (No Cascading Render)
    useEffect(() => {
        let isMounted = true; // মেমোরি লিক ঠেকানোর জন্য
        
        const loadInitialData = async () => {
            try {
                const res = await fetch('/api/order');
                if (res.ok) {
                    const data: Order[] = await res.json();
                    // শুধুমাত্র কম্পোনেন্ট মাউন্ট থাকলে স্টেট আপডেট হবে
                    if (isMounted) {
                        setOrders(data);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Initial load error");
                if (isMounted) setLoading(false);
            }
        };

        loadInitialData();

        // ক্লিনআপ ফাংশন
        return () => {
            isMounted = false;
        };
    }, []);

    const handleStatusChange = async (dbId: string, newStatus: Order['status']) => {
        try {
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, status: newStatus }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(order => order._id === dbId ? { ...order, status: newStatus } : order));
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (error) { toast.error("Status update failed!"); }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-800">Recent Shipments</h2>
                <button 
                    onClick={fetchOrders} 
                    disabled={loading}
                    className="text-red-600 hover:text-black transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
                >
                    <FaSync className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {loading && orders.length === 0 ? (
                 <div className="w-full h-40 flex items-center justify-center">
                     <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                 </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold text-gray-600">
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b last:border-none hover:bg-gray-50/50 transition-all">
                                    <td className="p-4 font-black text-gray-900">{order.id}</td>
                                    <td className="p-4">
                                        <p className="font-black text-gray-800 uppercase text-xs">{order.customerName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{order.customerPhone}</p>
                                    </td>
                                    <td className="p-4 text-red-600 font-black">৳{order.total.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' : 
                                              order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 
                                              order.status === 'Processing' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <select className="border-2 border-gray-100 p-1.5 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer focus:border-red-600 transition-all bg-white" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}>
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;