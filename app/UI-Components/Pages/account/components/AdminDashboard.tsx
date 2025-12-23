'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaBoxOpen, FaShoppingBag, FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

// ইন্টারফেস ডিফাইন
interface Props {
    handleLogout: () => void;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    total: number;
    paymentMethod: string;
    status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
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

const AdminDashboard = ({ handleLogout }: Props) => {
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false); // ইমেজ আপলোড স্টেট
    const [orders, setOrders] = useState<Order[]>([]);
    
    const [productData, setProductData] = useState<ProductForm>({
        title: '', price: '', lessPrice: '', image: '', category: 'Mobile Phone', 
        section: 'TopSelling', sale: 'New', review: '(10 Reviews)', sold: '0/0',
        fastCharging: 'Yes', wireless: 'Yes', waterResistant: 'Yes',
        description: '', keyFeatures: ''
    });

    // ১. ইমেজ আপলোড হ্যান্ডলার (ImgBB)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;; 
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
        } catch (error) {
            toast.error("Error connecting to Image Server");
        } finally {
            setUploadingImage(false);
        }
    };

    // ২. অর্ডার লোড করা
    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');
        if(storedOrders.length === 0) {
            const dummyOrders: Order[] = [
                { id: "#ORD-101", customerName: "Rahim Uddin", customerEmail: "rahim@mail.com", date: "22 Dec, 2025", total: 15000, paymentMethod: "COD", status: "Pending" },
                { id: "#ORD-102", customerName: "Karim Khan", customerEmail: "karim@mail.com", date: "21 Dec, 2025", total: 4500, paymentMethod: "bKash", status: "Processing" },
            ];
            localStorage.setItem('all_orders', JSON.stringify(dummyOrders));
            setOrders(dummyOrders);
        } else {
            setOrders(storedOrders);
        }
    }, []);

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    // ৩. ফাইনাল প্রোডাক্ট আপলোড
    const handleProductUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!productData.image) {
            return toast.error("Please upload a product image first!");
        }

        setLoading(true);
        const featuresArray = productData.keyFeatures.split('\n').filter(line => line.trim() !== '');
        const finalData = { ...productData, keyFeatures: featuresArray };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            
            const data = await res.json();
            if (res.ok) {
                toast.success(`Product Uploaded Successfully!`);
                setProductData({
                    title: '', price: '', lessPrice: '', image: '', category: 'Mobile Phone',
                    section: 'TopSelling', sale: 'New', review: '(10 Reviews)', sold: '0/0',
                    fastCharging: 'Yes', wireless: 'Yes', waterResistant: 'Yes',
                    description: '', keyFeatures: ''
                });
            } else {
                toast.error(data.message || "Failed to upload");
            }
        } catch (error) {
            toast.error("Database connection failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        const updatedOrders = orders.map(order => 
            order.id === id ? { ...order, status: newStatus as Order['status'] } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('all_orders', JSON.stringify(updatedOrders));
        toast.success(`Order status updated to ${newStatus}`);
    };

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-600">
                <h1 className="text-2xl font-bold text-gray-800">Admin <span className='text-red-600'>Panel</span></h1>
                <div className='flex items-center gap-4'>
                    <span className='font-bold bg-red-100 px-3 py-1 rounded-full text-xs text-red-600 uppercase tracking-wider'>Super Admin</span>
                    <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-black text-sm transition">Logout</button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-sm h-fit space-y-2">
                    <button onClick={()=>setActiveTab('orders')} className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                        <FaShoppingBag /> Orders <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>{orders.length}</span>
                    </button>
                    <button onClick={()=>setActiveTab('upload')} className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-red-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                        <FaPlus /> Upload Product
                    </button>
                    <button onClick={()=>setActiveTab('products')} className={`w-full text-left p-3 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-red-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                        <FaBoxOpen /> All Products
                    </button>
                </div>

                {/* Content Area */}
                <div className="w-full lg:w-3/4 bg-white p-6 lg:p-8 rounded-lg shadow-sm">
                    
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 border-b pb-2 flex items-center gap-2 text-gray-800">
                                <FaShoppingBag className="text-red-600"/> Recent Orders
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-black">
                                            <th className="p-3 border-b">Order ID</th>
                                            <th className="p-3 border-b">Customer</th>
                                            <th className="p-3 border-b">Amount</th>
                                            <th className="p-3 border-b">Status</th>
                                            <th className="p-3 border-b text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm text-gray-600">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="p-3 font-bold text-gray-800">{order.id}</td>
                                                <td className="p-3">
                                                    <p className="font-bold">{order.customerName}</p>
                                                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                                </td>
                                                <td className="p-3 font-bold text-red-600">৳{order.total}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase
                                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                                                          order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 
                                                          order.status === 'Processing' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <select 
                                                        className="border p-1 rounded text-xs outline-none cursor-pointer bg-white font-bold"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-800 flex items-center gap-2">
                                <FaPlus className='text-red-600'/> Add New Product
                            </h2>
                            <form onSubmit={handleProductUpload} className="space-y-5">
                                
                                {/* Image Upload Field */}
                                <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                                    {productData.image ? (
                                        <div className="relative group">
                                            <img src={productData.image} alt="Preview" className="h-40 w-40 object-cover rounded-lg shadow-md border" />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                                                <label className="text-white text-xs font-bold cursor-pointer">Change Image
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center cursor-pointer hover:text-red-600 transition">
                                            {uploadingImage ? <FaSpinner className="animate-spin text-3xl mb-2 text-red-600" /> : <FaCloudUploadAlt className="text-4xl mb-2 text-gray-400" />}
                                            <span className="font-bold text-sm text-gray-600">{uploadingImage ? 'Uploading to Server...' : 'Click to Upload Product Image'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>

                                {/* Section Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-500 mb-1">Display Section</label>
                                        <select name="section" className="w-full p-3 border rounded-lg outline-none focus:border-red-500 font-bold text-gray-700 bg-white" onChange={handleProductChange} value={productData.section}>
                                            <option value="TopSelling">Top Selling Products</option>
                                            <option value="BestDeals">Best Deals</option>
                                            <option value="HotDeals">Hot Deals</option>
                                            <option value="NewArrivals">New Arrivals</option>
                                            <option value="Featured">Featured Products</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-500 mb-1">Category</label>
                                        <select name="category" className="w-full p-3 border rounded-lg font-bold bg-white" onChange={handleProductChange} value={productData.category}>
                                            <option value="Mobile Phone">Mobile Phone</option>
                                            <option value="Laptop">Laptop</option>
                                            <option value="Smart Watch">Smart Watch</option>
                                            <option value="Drone">Drone</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Earbuds">Earbuds</option>
                                            <option value="Camera">Camera</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Product Title</label>
                                    <input type="text" name="title" required className="w-full p-3 border rounded-lg outline-none focus:border-red-500" placeholder="e.g. iPhone 15 Pro Max" onChange={handleProductChange} value={productData.title} />
                                </div>

                                {/* Prices & Sale */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-500 mb-1">Price (৳)</label>
                                        <input type="text" name="price" required className="w-full p-3 border rounded-lg" placeholder="2990" onChange={handleProductChange} value={productData.price} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-500 mb-1">Regular Price</label>
                                        <input type="text" name="lessPrice" className="w-full p-3 border rounded-lg" placeholder="3500" onChange={handleProductChange} value={productData.lessPrice} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-gray-500 mb-1">Tag (New/Sale)</label>
                                        <input type="text" name="sale" className="w-full p-3 border rounded-lg" placeholder="New" onChange={handleProductChange} value={productData.sale} />
                                    </div>
                                </div>

                                {/* Feature Toggles */}
                                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase mb-1">Fast Charge</label>
                                        <select name="fastCharging" className="w-full p-2 border rounded text-xs font-bold" onChange={handleProductChange} value={productData.fastCharging}>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase mb-1">Wireless</label>
                                        <select name="wireless" className="w-full p-2 border rounded text-xs font-bold" onChange={handleProductChange} value={productData.wireless}>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase mb-1">Water Res.</label>
                                        <select name="waterResistant" className="w-full p-2 border rounded text-xs font-bold" onChange={handleProductChange} value={productData.waterResistant}>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description & Features */}
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Short Description</label>
                                    <textarea name="description" rows={3} className="w-full p-3 border rounded-lg resize-none" placeholder="Product short summary..." onChange={handleProductChange} value={productData.description}></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Key Features (One per line)</label>
                                    <textarea name="keyFeatures" rows={4} className="w-full p-3 border rounded-lg resize-none bg-yellow-50 focus:bg-white transition" placeholder="Feature 1&#10;Feature 2" onChange={handleProductChange} value={productData.keyFeatures}></textarea>
                                </div>

                                <button 
                                    disabled={loading || uploadingImage} 
                                    className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-black transition disabled:opacity-50 text-lg shadow-lg flex items-center justify-center gap-2"
                                >
                                    {loading ? <FaSpinner className="animate-spin" /> : null}
                                    {loading ? 'Processing...' : 'Upload Product to Database'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="text-center py-20 text-gray-400">
                            <FaBoxOpen className="text-6xl mb-4 mx-auto opacity-20" />
                            <p className='font-bold uppercase text-xs tracking-widest'>Database Product List</p>
                            <p className='text-sm mt-1'>Coming Soon: Product Edit & Delete Management</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;