'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner, FaCloudUploadAlt, FaSync, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

interface SliderData {
    _id: string; titleStart: string; titleHighlight: string; titleEnd: string;
    image: string; link: string; badge: string; description: string;
    buttonText: string; secondaryBtnText?: string; secondaryBtnLink?: string;
}

const ManageSlidersTab = () => {
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const[fetchingData, setFetchingData] = useState(true);
    const [activeSliders, setActiveSliders] = useState<SliderData[]>([]);
    
    // === নতুন Edit State ===
    const [editId, setEditId] = useState<string | null>(null);

    const [sliderData, setSliderData] = useState({
        badge: 'Premium Audio', titleStart: '', titleHighlight: '', titleEnd: '',
        description: '', buttonText: 'Shop Now', link: '/UI-Components/Shop',
        secondaryBtnText: '', secondaryBtnLink: '', image: ''
    });

    const fetchSliders = async () => {
        setFetchingData(true);
        try {
            const res = await fetch('/api/sliders');
            if (res.ok) setActiveSliders(await res.json());
        } catch (error) { console.error("Failed to fetch sliders"); } 
        finally { setFetchingData(false); }
    };

    useEffect(() => { fetchSliders(); },[]);

    const uploadImage = async (file: File) => {
        setUploadingImage(true);
        const formData = new FormData(); formData.append('image', file);
        try {
            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string; 
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
            const data = await res.json();
            return data.success ? data.data.url : null;
        } catch (error) { return null; } 
        finally { setUploadingImage(false); }
    };

    // === Update or Upload Logic ===
    const handleSliderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!sliderData.image) return toast.error("Please upload slider image!");
        setLoading(true);
        try {
            // যদি editId থাকে, তার মানে আমরা এডিট করছি (PATCH), না থাকলে নতুন আপলোড (POST)
            const method = editId ? 'PATCH' : 'POST';
            const bodyData = editId ? { ...sliderData, _id: editId } : sliderData;

            const res = await fetch('/api/sliders', {
                method, 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(bodyData),
            });

            if (res.ok) {
                toast.success(editId ? "Slider Updated Successfully! 🎉" : "Slider Published! 🎉");
                handleCancelEdit(); // ফর্ম রিসেট করা
                fetchSliders(); // লিস্ট আপডেট করা
            } else {
                toast.error("Action failed!");
            }
        } catch (error) { toast.error("Something went wrong!"); } 
        finally { setLoading(false); }
    };

    // === Edit Button Click Logic ===
    const handleEditClick = (slider: SliderData) => {
        // ফর্মের ভেতরে ক্লিক করা স্লাইডারের ডেটা বসিয়ে দেওয়া
        setSliderData({
            badge: slider.badge, titleStart: slider.titleStart, titleHighlight: slider.titleHighlight, 
            titleEnd: slider.titleEnd || '', description: slider.description, 
            buttonText: slider.buttonText, link: slider.link, 
            secondaryBtnText: slider.secondaryBtnText || '', secondaryBtnLink: slider.secondaryBtnLink || '', 
            image: slider.image
        });
        setEditId(slider._id);
        
        // স্ক্রিনটাকে স্মুথলি ফর্মের একদম উপরে নিয়ে যাওয়া
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // === Cancel Edit Logic ===
    const handleCancelEdit = () => {
        setEditId(null);
        setSliderData({ badge: 'New Arrival', titleStart: '', titleHighlight: '', titleEnd: '', description: '', buttonText: 'Shop Now', link: '/UI-Components/Shop', secondaryBtnText: '', secondaryBtnLink: '', image: '' });
    };

    // Delete Logic
    const handleDeleteSlider = async (id: string) => {
        if(!confirm("Are you sure you want to delete this slider?")) return;
        try {
            const res = await fetch(`/api/sliders?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Slider deleted!");
                setActiveSliders(prev => prev.filter(slider => slider._id !== id));
            } else toast.error("Failed to delete slider");
        } catch (error) { toast.error("Something went wrong"); }
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-12">
            
            {/* === UPLOAD / EDIT FORM SECTION === */}
            <div className={`p-8 rounded-[2.5rem] transition-all duration-500 ${editId ? 'bg-blue-50/50 border-2 border-blue-200 shadow-xl' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-xl font-black uppercase text-gray-800">
                        {editId ? <span className="text-blue-600 flex items-center gap-2"><FaEdit/> Edit Slider Mode</span> : 'Add New Slider'}
                    </h2>
                    {editId && (
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                            Updating...
                        </span>
                    )}
                </div>

                <form onSubmit={handleSliderSubmit} className="space-y-6">
                    {/* Image Upload Box */}
                    <div className={`p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-colors ${editId ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                        {sliderData.image ? (
                            <div className="relative">
                                <img src={sliderData.image} alt="Slide" className="h-44 w-80 object-cover rounded-xl shadow-lg" />
                                <button type="button" onClick={() => setSliderData({...sliderData, image: ''})} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-black transition-all"><FaTimes size={12}/></button>
                            </div>
                        ) : (
                            <label className="cursor-pointer text-center group">
                                {uploadingImage ? <FaSpinner className="animate-spin text-3xl mb-3 text-red-600 mx-auto" /> : <FaCloudUploadAlt className={`text-5xl mx-auto mb-2 transition-all ${editId ? 'text-blue-300 group-hover:text-blue-600' : 'text-gray-300 group-hover:text-red-600'}`}/>}
                                <span className="font-black text-[10px] uppercase text-gray-400">Upload Banner Image (1200x500px)</span>
                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                    if(e.target.files && e.target.files[0]) {
                                        const url = await uploadImage(e.target.files[0]);
                                        if(url) setSliderData({...sliderData, image: url});
                                    }
                                }} />
                            </label>
                        )}
                    </div>

                    {/* Texts & Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" placeholder="Tag/Badge (e.g. Premium Audio)" className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm md:col-span-1" value={sliderData.badge} onChange={(e)=>setSliderData({...sliderData, badge: e.target.value})} required />
                        <input type="text" placeholder="Title Start (Black)" className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm md:col-span-1" value={sliderData.titleStart} onChange={(e)=>setSliderData({...sliderData, titleStart: e.target.value})} required />
                        <input type="text" placeholder="Highlight Text (Red)" className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm md:col-span-1" value={sliderData.titleHighlight} onChange={(e)=>setSliderData({...sliderData, titleHighlight: e.target.value})} required />
                        <input type="text" placeholder="Title End (Black - Optional)" className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm md:col-span-1" value={sliderData.titleEnd} onChange={(e)=>setSliderData({...sliderData, titleEnd: e.target.value})} />
                    </div>
                    
                    <textarea placeholder="Short Description..." rows={2} className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm resize-none" value={sliderData.description} onChange={(e)=>setSliderData({...sliderData, description: e.target.value})} required></textarea>

                    {/* Buttons Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[2rem] border ${editId ? 'bg-blue-50/30 border-blue-100' : 'bg-gray-50 border-transparent'}`}>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-red-600 uppercase tracking-widest">Primary Button (Required)</label>
                            <input type="text" placeholder="Btn Text (e.g. Shop Now)" className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm shadow-sm" value={sliderData.buttonText} onChange={(e)=>setSliderData({...sliderData, buttonText: e.target.value})} required />
                            <input type="text" placeholder="Btn Link (e.g. /UI-Components/Shop)" className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm shadow-sm" value={sliderData.link} onChange={(e)=>setSliderData({...sliderData, link: e.target.value})} required />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Secondary Button (Optional)</label>
                            <input type="text" placeholder="Btn Text (e.g. View Specs)" className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-gray-400 font-bold text-sm shadow-sm" value={sliderData.secondaryBtnText} onChange={(e)=>setSliderData({...sliderData, secondaryBtnText: e.target.value})} />
                            <input type="text" placeholder="Btn Link (e.g. /ProductDetails/123)" className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-gray-400 font-bold text-sm shadow-sm" value={sliderData.secondaryBtnLink} onChange={(e)=>setSliderData({...sliderData, secondaryBtnLink: e.target.value})} />
                        </div>
                    </div>

                    {/* Submit & Cancel Buttons */}
                    <div className="flex gap-4">
                        <button type="submit" disabled={loading || uploadingImage} className={`flex-1 py-5 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl disabled:opacity-50 ${editId ? 'bg-blue-600 hover:bg-black' : 'bg-red-600 hover:bg-black'}`}>
                            {loading ? <FaSpinner className="animate-spin inline" /> : editId ? 'Update Slider Data' : 'Publish to Home Page'}
                        </button>
                        
                        {editId && (
                            <button type="button" onClick={handleCancelEdit} className="py-5 px-8 bg-gray-200 text-gray-800 font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* === ACTIVE SLIDERS LIST SECTION === */}
            <div>
                <h2 className="text-xl font-black uppercase mb-6 border-b pb-4 text-gray-800 flex justify-between items-center">
                    Active Home Sliders
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black">{activeSliders.length} Live</span>
                </h2>
                
                {fetchingData ? (
                    <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-3xl text-red-600" /></div>
                ) : activeSliders.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="font-bold text-gray-400 text-sm">No sliders found. Upload one to see it here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeSliders.map((slider) => (
                            <div key={slider._id} className={`bg-white rounded-[2rem] shadow-sm overflow-hidden flex items-center p-4 gap-4 group hover:shadow-lg transition-all ${editId === slider._id ? 'border-2 border-blue-400' : 'border border-gray-100'}`}>
                                <img src={slider.image} alt="Slide" className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                                <div className="flex-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{slider.badge}</span>
                                    <h3 className="font-black text-gray-800 text-sm mt-1">{slider.titleStart} <span className="text-red-600">{slider.titleHighlight}</span></h3>
                                    <p className="text-[10px] text-gray-500 font-bold line-clamp-1">{slider.description}</p>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => handleEditClick(slider)} className="text-gray-400 hover:text-blue-600 transition-colors p-2 bg-gray-50 rounded-full hover:bg-blue-50" title="Edit Slider"><FaEdit size={14} /></button>
                                    <button onClick={() => handleDeleteSlider(slider._id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 bg-gray-50 rounded-full hover:bg-red-50" title="Delete Slider"><FaTrash size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSlidersTab;