'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ViewState = 'login' | 'signup' | 'account' | 'forgot-password' | 'admin-dashboard';

interface Props {
  setCurrentView: (view: ViewState) => void;
}

const SignupView = ({ setCurrentView }: Props) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              password: formData.password
          })
      });

      const data = await res.json();

      if (res.ok) {
          toast.success("Account Created Successfully!");
          setCurrentView('login');
      } else {
          toast.error(data.message || "Signup Failed!");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-20 px-4">
      <div className="bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row max-w-5xl w-full border border-gray-100">
        
        {/* বাম সাইড: ডিজাইন ও ব্র্যান্ডিং বক্স */}
        <div className="md:w-1/2 bg-black p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600 rounded-full -ml-16 -mb-16 opacity-50 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6 unbounded">
              Join <br /><span className="text-red-600">Us.</span>
            </h2>
            <p className="text-gray-400 font-medium mb-8">Create an account to track orders, get exclusive tech deals, and manage your gadgets.</p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Quick Order Tracking
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Member-only Discounts
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Secure & Faster Checkout
                </div>
            </div>
          </div>
        </div>

        {/* ডান সাইড: সাইন-আপ ফর্ম */}
        <div className="md:w-1/2 p-8 md:p-14">
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Create Account</h2>
          <p className="text-gray-400 text-sm mb-8 font-bold">Start your tech journey with ENT Gadget.</p>
          
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">First Name</label>
                <input 
                    type="text" 
                    required 
                    className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-sm" 
                    placeholder="John" 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Last Name</label>
                <input 
                    type="text" 
                    required 
                    className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-sm" 
                    placeholder="Doe" 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                />
              </div>
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Address</label>
                <input 
                    type="email" 
                    required 
                    className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-sm" 
                    placeholder="example@mail.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
            </div>

            <div className="relative">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Secure Password</label>
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

            <button 
                disabled={loading} 
                className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 mt-4"
            >
              {loading ? <AiOutlineLoading3Quarters className="animate-spin text-lg" /> : 'Create My Account'}
            </button>
          </form>

          {/* সোশ্যাল সাইন-আপ (UI Only) */}
          <div className="mt-8">
              <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] bg-gray-100 flex-1"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or sign up with</span>
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

          <p className="text-center text-gray-500 mt-10 text-sm font-bold">
            Already have an account? <br />
            <span 
                onClick={() => setCurrentView('login')} 
                className="text-red-600 font-black hover:underline cursor-pointer uppercase text-xs tracking-widest"
            >
                Login to Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupView;