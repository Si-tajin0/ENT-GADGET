'use client';

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaBoxOpen, FaShoppingBag, FaCloudUploadAlt, FaSpinner, FaSync } from 'react-icons/fa';

// ১. ইন্টারফেসসমূহ (any এরর দূর করার জন্য)
interface Order {
    _id: string; // MongoDB Unique ID
    id: string;  // ENT-123456 আইডি
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    total: number;
    paymentMethod: string;
    txnId: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: string;
}

interface ProductForm {
    title: string;
    price: string;
    category: string;
    image: string;
    sale: string;
    lessPrice: string;
    review: string;
    sold: string;
    fastCharging: string;
    wireless: string;
    waterResistant: string;
    description: string;
    keyFeatures: string;
    section: string;
}

interface Props {
    handleLogout: () => void;
}

const AdminDashboard = ({ handleLogout }: Props) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'upload' | 'products'>('orders');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    
    const [productData, setProductData] = useState<ProductForm>({
        title: '', price: '', lessPrice: '', image: '', category: 'Mobile Phone', 
        section: 'TopSelling', sale: 'New', review: '(10 Reviews)', sold: '0/0',
        fastCharging: 'Yes', wireless: 'Yes', waterResistant: 'Yes',
        description: '', keyFeatures: ''
    });

    // ২. ডাটাবেস থেকে অর্ডার ফেচ করা (useCallback ফর মেমোরি অপ্টিমাইজেশন)
    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch('/api/order');
            if (res.ok) {
                const data: Order[] = await res.json();
                setOrders(data);
            }
        } catch (error: unknown) {
            console.error("Order load error");
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ৩. ইমেজ আপলোড (ImgBB)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string; 
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setProductData(prev => ({ ...prev, image: data.data.url }));
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Image upload failed!");
            }
        } catch (error: unknown) {
            toast.error("Error connecting to Image Server");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    // ৪. প্রোডাক্ট আপলোড
    const handleProductUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!productData.image) return toast.error("Please upload image!");

        setLoading(true);
        // keyFeatures কে অ্যারেতে কনভার্ট করা
        const finalProductData = {
            ...productData,
            keyFeatures: productData.keyFeatures.split('\n').filter(line => line.trim() !== '')
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalProductData),
            });
            
            if (res.ok) {
                toast.success(`Product Uploaded to ${productData.section}!`);
                setProductData({
                    title: '', price: '', lessPrice: '', image: '', category: 'Mobile Phone',
                    section: 'TopSelling', sale: 'New', review: '(10 Reviews)', sold: '0/0',
                    fastCharging: 'Yes', wireless: 'Yes', waterResistant: 'Yes',
                    description: '', keyFeatures: ''
                });
            }
        } catch (error: unknown) {
            toast.error("Failed to upload product!");
        } finally {
            setLoading(false);
        }
    };

    // ৫. রিয়েল-টাইম স্ট্যাটাস আপডেট (শিপমেন্ট অপশন সহ)
    const handleStatusChange = async (dbId: string, newStatus: Order['status']) => {
        try {
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, status: newStatus }),
            });

            if (res.ok) {
                setOrders(prev => prev.map(order => 
                    order._id === dbId ? { ...order, status: newStatus } : order
                ));
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (error: unknown) {
            toast.error("Status update failed!");
        }
    };

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen text-gray-800">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border-l-8 border-red-600">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Admin <span className='text-red-600'>Panel</span></h1>
                <div className='flex items-center gap-4'>
                    <span className='font-black bg-black text-white px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest'>Super Admin</span>
                    <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition-all text-xs uppercase shadow-lg shadow-red-100">Logout</button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-1/4 bg-white p-5 rounded-[2rem] shadow-sm h-fit space-y-2 border border-gray-100">
                    <button onClick={()=>setActiveTab('orders')} className={`w-full text-left p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-xl shadow-red-100' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <FaShoppingBag /> Orders Management <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] ${activeTab === 'orders' ? 'bg-white text-red-600' : 'bg-gray-100'}`}>{orders.length}</span>
                    </button>
                    <button onClick={()=>setActiveTab('upload')} className={`w-full text-left p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'upload' ? 'bg-red-600 text-white shadow-xl shadow-red-100' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <FaPlus /> Upload Gadget
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="w-full lg:w-3/4 bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    
                    {/* === ORDERS TAB === */}
                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-800">Recent Shipments</h2>
                                <button onClick={fetchOrders} className="text-red-600 hover:text-black transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                                    <FaSync /> Refresh
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b">
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Payment</th>
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
                                                    <p className="text-[10px] font-black uppercase tracking-tighter leading-tight">{order.paymentMethod}</p>
                                                    <p className="text-[9px] text-blue-500 font-black tracking-widest uppercase mt-1">Trx: {order.txnId || "N/A"}</p>
                                                </td>
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
                                                    <select 
                                                        className="border-2 border-gray-100 p-1.5 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer focus:border-red-600 transition-all bg-white"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                                                    >
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
                                {orders.length === 0 && <p className="text-center py-20 text-gray-300 font-black uppercase text-xs tracking-widest">No orders found.</p>}
                            </div>
                        </div>
                    )}

                    {/* === UPLOAD PRODUCT TAB === */}
                    {activeTab === 'upload' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-gray-800 mb-8 border-b pb-4">Add New Gadget</h2>
                            <form onSubmit={handleProductUpload} className="space-y-6">
                                
                                {/* Image Upload */}
                                <div className="bg-gray-50 p-10 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group hover:border-red-600 transition-all duration-500">
                                    {productData.image ? (
                                        <div className="relative">
                                            <img src={productData.image} alt="Preview" className="h-40 w-40 object-contain rounded-2xl shadow-xl" />
                                            <label className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-lg active:scale-90 transition-all">
                                                <FaSync size={12} />
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center cursor-pointer text-gray-400 group-hover:text-red-600 transition-all">
                                            {uploadingImage ? <FaSpinner className="animate-spin text-3xl mb-3 text-red-600" /> : <FaCloudUploadAlt className="text-5xl mb-3" />}
                                            <span className="font-black text-[10px] uppercase tracking-widest">{uploadingImage ? 'Uploading...' : 'Drop Product Image Here'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Website Section</label>
                                        <select name="section" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" onChange={handleProductChange} value={productData.section}>
                                            <option value="TopSelling">Top Selling Products</option>
                                            <option value="BestDeals">Best Deals</option>
                                            <option value="HotDeals">Hot Deals</option>
                                            <option value="NewArrivals">New Arrivals</option>
                                            <option value="Featured">Featured Products</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                                        <select name="category" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" onChange={handleProductChange} value={productData.category}>
                                            <option value="Mobile Phone">Mobile Phone</option>
                                            <option value="Laptop">Laptop</option>
                                            <option value="Smart Watch">Smart Watch</option>
                                            <option value="Drone">Drone</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Product Title</label>
                                    <input type="text" name="title" required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" placeholder="e.g. MacBook Pro M3" onChange={handleProductChange} value={productData.title} />
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Sale Price</label>
                                        <input type="text" name="price" required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" placeholder="৳ 2500" onChange={handleProductChange} value={productData.price} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Old Price</label>
                                        <input type="text" name="lessPrice" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" placeholder="৳ 3000" onChange={handleProductChange} value={productData.lessPrice} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tag (Sale/New)</label>
                                        <input type="text" name="sale" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" placeholder="30% OFF" onChange={handleProductChange} value={productData.sale} />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading || uploadingImage} 
                                    className="w-full py-5 bg-red-600 text-white font-black rounded-[1.5rem] hover:bg-black transition-all disabled:opacity-50 text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-200"
                                >
                                    {loading ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                                    {loading ? 'Uploading...' : 'Publish to Store'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;