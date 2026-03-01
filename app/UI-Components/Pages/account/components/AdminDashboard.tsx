'use client';

import React, { useState } from 'react';
import { FaPlus, FaShoppingBag, FaImages } from 'react-icons/fa';

// আমাদের তৈরি করা নতুন কম্পোনেন্টগুলো ইম্পোর্ট করছি
import OrdersTab from './OrdersTab';
import UploadGadgetTab from './UploadGadgetTab';
import ManageSlidersTab from './ManageSlidersTab';

interface Props {
    handleLogout: () => void;
}

const AdminDashboard = ({ handleLogout }: Props) => {
    // শুধু ট্যাব ম্যানেজমেন্টের স্টেটটা এখানে রাখলাম
    const [activeTab, setActiveTab] = useState<'orders' | 'upload' | 'sliders'>('orders');

    return (
        <div className="px-[5%] lg:px-[12%] py-10 bg-gray-50 min-h-screen text-gray-800">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border-l-8 border-red-600">
                <h1 className="text-2xl font-black uppercase tracking-tighter">Admin <span className='text-red-600'>Panel</span></h1>
                <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition-all text-xs uppercase shadow-lg">Logout</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-1/4 bg-white p-5 rounded-[2rem] shadow-sm h-fit space-y-2 border border-gray-100">
                    <button onClick={()=>setActiveTab('orders')} className={`w-full text-left p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <FaShoppingBag /> Orders 
                    </button>
                    <button onClick={()=>setActiveTab('upload')} className={`w-full text-left p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'upload' ? 'bg-red-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <FaPlus /> Upload Gadget
                    </button>
                    <button onClick={()=>setActiveTab('sliders')} className={`w-full text-left p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'sliders' ? 'bg-red-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <FaImages /> Home Slider
                    </button>
                </div>

                {/* Main Content Area (Dynamic Render) */}
                <div className="w-full lg:w-3/4 bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[600px]">
                    {activeTab === 'orders' && <OrdersTab />}
                    {activeTab === 'upload' && <UploadGadgetTab />}
                    {activeTab === 'sliders' && <ManageSlidersTab />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;