'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner, FaCloudUploadAlt, FaSync, FaMagic, FaFire, FaMoneyBillWave } from 'react-icons/fa';

interface ProductForm {
    title: string; price: string; category: string; image: string; sale: string;
    lessPrice: string; review: string; sold: string; fastCharging: string;
    wireless: string; waterResistant: string; description: string; keyFeatures: string;
    section: string; metaTitle: string; metaDescription: string;
}

const UploadGadgetTab = () => {
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const[generatingAI, setGeneratingAI] = useState(false);
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    
    const [productData, setProductData] = useState<ProductForm>({
        title: '', price: '', lessPrice: '', image: '', category: 'Mobile Phone', 
        section: 'TopSelling', sale: 'New', review: '(10 Reviews)', sold: '0/0',
        fastCharging: 'Yes', wireless: 'Yes', waterResistant: 'Yes',
        description: '', keyFeatures: '', metaTitle: '', metaDescription: ''
    });

    // --- NEW: Live Discount Calculator Effect ---
    useEffect(() => {
        const currentPrice = Number(productData.price);
        const oldPrice = Number(productData.lessPrice);

        if (currentPrice > 0 && oldPrice > currentPrice) {
            const discount = ((oldPrice - currentPrice) / oldPrice) * 100;
            setDiscountPercent(Math.round(discount));
        } else {
            setDiscountPercent(0);
        }
    },[productData.price, productData.lessPrice]);

    const uploadImage = async (file: File): Promise<string | null> => {
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
            if (data.success) return data.data.url;
            return null;
        } catch (error) {
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAIGenerate = async () => {
        if (!productData.title) return toast.error("Please enter a product title first!");
        setGeneratingAI(true);
        try {
            const res = await fetch('/api/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: productData.title }),
            });
            const data = await res.json();
            if (res.ok) {
                setProductData(prev => ({
                    ...prev,
                    description: data.description,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    keyFeatures: data.keyFeatures
                }));
                toast.success("AI generated content added!");
            }
        } catch (error) {
            toast.error("Failed to connect to AI server");
        } finally {
            setGeneratingAI(false);
        }
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!productData.image) return toast.error("Please upload image!");
        setLoading(true);
        const finalData = { ...productData, keyFeatures: productData.keyFeatures.split('\n').filter(l => l.trim() !== '') };
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            if (res.ok) {
                toast.success("Gadget Published!");
                setProductData({
                    title: '', price: '', lessPrice: '', image: '', category: 'Mobile Phone',
                    section: 'TopSelling', sale: 'New', review: '(10 Reviews)', sold: '0/0',
                    fastCharging: 'Yes', wireless: 'Yes', waterResistant: 'Yes',
                    description: '', keyFeatures: '', metaTitle: '', metaDescription: ''
                });
                setDiscountPercent(0);
            }
        } catch (error) { toast.error("Publish failed!"); }
        finally { setLoading(false); }
    };

    return (
        <div className="animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-800">Add New Gadget</h2>
                <button type="button" onClick={handleAIGenerate} disabled={generatingAI} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50">
                    {generatingAI ? <FaSpinner className="animate-spin" /> : <FaMagic className="text-red-600" />}
                    {generatingAI ? 'AI generating...' : 'AI Magic Write'}
                </button>
            </div>

            <form onSubmit={handleProductUpload} className="space-y-6">
                <div className="bg-gray-50 p-10 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group hover:border-red-600 transition-all duration-500">
                    {productData.image ? (
                        <div className="relative">
                            <img src={productData.image} alt="Preview" className="h-40 w-40 object-contain rounded-2xl shadow-xl bg-white p-2" />
                            <label className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-lg active:scale-90 transition-all">
                                <FaSync size={12} />
                                <input type="file" className="hidden" onChange={async (e) => { const url = await uploadImage(e.target.files![0]); if(url) setProductData({...productData, image: url}); }} />
                            </label>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer text-gray-400 group-hover:text-red-600 transition-all">
                            {uploadingImage ? <FaSpinner className="animate-spin text-3xl mb-3 text-red-600" /> : <FaCloudUploadAlt className="text-5xl mb-3" />}
                            <span className="font-black text-[10px] uppercase tracking-widest">Upload Image</span>
                            <input type="file" className="hidden" onChange={async (e) => { const url = await uploadImage(e.target.files![0]); if(url) setProductData({...productData, image: url}); }} />
                        </label>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" name="title" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm" placeholder="Product Title" value={productData.title} onChange={handleProductChange} />
                    <select name="category" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm cursor-pointer" onChange={handleProductChange} value={productData.category}>
                        <option value="Drone">Drone</option>
                        <option value="Gimbal">Gimbal</option>
                        <option value="Tablet PC">Tablet PC</option>
                        <option value="TV">TV</option>
                        <option value="Mobile Phone">Mobile Phone</option>
                        <option value="Mobile Accessories">Mobile Accessories</option>
                        <option value="Portable SSD">Portable SSD</option>
                        <option value="Camera">Camera</option>
                        <option value="Trimmer">Trimmer</option>
                        <option value="Smart Watch">Smart Watch</option>
                        <option value="Earbuds">Earbuds</option>
                        <option value="Bluetooth Speakers">Bluetooth Speakers</option>
                        <option value="Gaming Console">Gaming Console</option>
                        <option value="Headphone">Headphone</option>
                        <option value="Power Bank">Power Bank</option>
                        <option value="Smart Home">Smart Home</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" name="metaTitle" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold text-sm" placeholder="SEO Meta Title" value={productData.metaTitle} onChange={handleProductChange} />
                    <input type="text" name="metaDescription" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold text-sm" placeholder="SEO Meta Description" value={productData.metaDescription} onChange={handleProductChange} />
                </div>

                <textarea name="description" rows={5} className="w-full p-5 bg-gray-50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-sm resize-none" placeholder="Description (AI Magic can write this for you)" value={productData.description} onChange={handleProductChange}></textarea>
                <textarea name="keyFeatures" rows={4} className="w-full p-5 bg-yellow-50/50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-xs resize-none" placeholder="Key Features (One per line)" value={productData.keyFeatures} onChange={handleProductChange}></textarea>

                {/* PRICING & SECTION AREA */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2">Sale Price (৳)</label>
                        <input type="number" name="price" placeholder="e.g. 5000" className="w-full p-4 bg-red-50/30 text-red-600 border border-red-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-black text-sm" value={productData.price} onChange={handleProductChange} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2">Old Price (৳)</label>
                        <input type="number" name="lessPrice" placeholder="e.g. 6000" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold text-sm" value={productData.lessPrice} onChange={handleProductChange} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2">Display Section</label>
                        <select name="section" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold text-sm cursor-pointer" onChange={handleProductChange} value={productData.section}>
                            <option value="TopSelling">Top Selling</option>
                            <option value="BestDeals">Best Deals</option>
                            <option value="HotDeals">🔥 Hot Deals</option>
                            <option value="NewArrivals">New Arrivals</option>
                            <option value="Featured">Featured</option>
                        </select>
                    </div>
                </div>

                {/* --- NEW: MAGIC LIVE PREVIEW BOX --- */}
                <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center gap-4 ${discountPercent > 0 ? 'bg-black border-black text-white' : 'bg-gray-50 border-dashed border-gray-200 text-gray-400'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 ${discountPercent >= 20 ? 'bg-red-600 animate-pulse text-white shadow-lg shadow-red-600/30' : 'bg-gray-200 text-gray-400'}`}>
                        {discountPercent > 0 ? <FaFire /> : <FaMoneyBillWave />}
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[11px] mb-1">
                            {discountPercent > 0 ? 'Offer Activated' : 'No Discount'}
                        </h4>
                        {discountPercent > 0 ? (
                            <p className="text-[11px] text-gray-300 leading-tight">
                                Custom gets <strong className="text-red-500">{discountPercent}% OFF!</strong> 
                                {productData.section === 'HotDeals' && discountPercent >= 15 && (
                                    <span className="block mt-1 text-[#00ffcc]">✨ Will auto-appear on Home Hot Banner!</span>
                                )}
                            </p>
                        ) : (
                            <p className="text-[10px]">Set a Sale Price lower than Old Price to offer discount.</p>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading || uploadingImage} className="w-full py-5 bg-red-600 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-100 hover:bg-black transition-all">
                    {loading ? <FaSpinner className="animate-spin inline" /> : 'Publish to Store'}
                </button>
            </form>
        </div>
    );
};

export default UploadGadgetTab;