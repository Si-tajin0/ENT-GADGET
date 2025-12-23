'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface User {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  role?: 'user' | 'admin';
}

type ViewState = 'login' | 'signup' | 'account' | 'forgot-password' | 'admin-dashboard';

interface Props {
  setCurrentView: (view: ViewState) => void;
  setUser: (user: User) => void;
}

const LoginView = ({ setCurrentView, setUser }: Props) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ১. হার্ডকোডেড অ্যাডমিন চেক
    if (formData.email === 'admin@entgadget.com' && formData.password === 'admin123') {
        const adminUser: User = { 
            name: 'System Admin', 
            email: 'admin@entgadget.com', 
            role: 'admin',
            fullName: 'Super Admin'
        };
        saveUserSession(adminUser);
        toast.success("Welcome Back, Admin!");
        setCurrentView('admin-dashboard');
        setLoading(false);
        return;
    }

    // ২. রিয়েল ডাটাবেস লগইন
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (res.ok) {
            const loggedInUser: User = data.user;
            saveUserSession(loggedInUser);
            toast.success(`Welcome, ${loggedInUser.name || 'User'}!`);

            if (loggedInUser.role === 'admin') {
                setCurrentView('admin-dashboard');
            } else {
                setCurrentView('account');
            }
        } else {
            toast.error(data.message || "Invalid Email or Password");
        }
    } catch (error) {
        toast.error("Network Error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // সেশন সেভ করার হেল্পার ফাংশন
  const saveUserSession = (user: User) => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setUser(user);
      window.dispatchEvent(new Event("authUpdate")); 
      window.dispatchEvent(new Event("storageUpdate"));
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-20 px-4">
      <div className="bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row-reverse max-w-5xl w-full border border-gray-100">
        
        {/* রাইট সাইড: ডিজাইন বক্স */}
        <div className="md:w-1/2 bg-black p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6 unbounded">
              ENT <br /><span className="text-red-600">Gadget.</span>
            </h2>
            <p className="text-gray-400 font-medium mb-8">Login to manage your orders, wishlist and profile settings.</p>
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Exclusive Deals for Members
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Faster Checkout Process
                </div>
            </div>
          </div>
        </div>

        {/* লেফট সাইড: লগইন ফর্ম */}
        <div className="md:w-1/2 p-8 md:p-14">
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Login Account</h2>
          <p className="text-gray-400 text-sm mb-8 font-bold">Please enter your credentials below.</p>
          
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Address</label>
                <input 
                    type="email" 
                    required 
                    className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-sm" 
                    placeholder="name@example.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
            </div>
            
            <div className="relative">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-xl pr-12 outline-none focus:border-red-600 transition-all font-bold text-sm" 
                    placeholder="••••••••" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-10 text-gray-400 hover:text-red-600 transition-colors"
                >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>

            <div className="flex justify-end">
                <button type="button" onClick={() => setCurrentView('forgot-password')} className="text-xs text-red-600 cursor-pointer hover:underline font-black uppercase tracking-widest">Forgot Password?</button>
            </div>

            <button 
                disabled={loading} 
                className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
            >
              {loading ? <AiOutlineLoading3Quarters className="animate-spin text-lg" /> : 'Login to Account'}
            </button>
          </form>

          {/* সোশ্যাল লগইন ডিজাইন (UI Only) */}
          <div className="mt-8">
              <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or login with</span>
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs">
                      <FaGoogle className="text-red-500" /> Google
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs">
                      <FaFacebook className="text-blue-600" /> Facebook
                  </button>
              </div>
          </div>

          <div className="mt-10 text-center">
             <p className="text-sm text-gray-500 font-bold">
                Don&apos;t have an account? <br />
                <span onClick={() => setCurrentView('signup')} className="text-red-600 font-black cursor-pointer hover:underline uppercase text-xs tracking-widest">Create New Account</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;