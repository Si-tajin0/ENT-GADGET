'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaArrowLeft, FaShieldAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ViewState = 'login' | 'signup' | 'account' | 'forgot-password' | 'admin-dashboard';

interface Props {
  setCurrentView: (view: ViewState) => void;
}

const ForgotPasswordView = ({ setCurrentView }: Props) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ১. ইমেইল ভেরিফিকেশন সিমুলেশন
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // API কল সিমুলেশন
    setTimeout(() => {
        toast.success("Reset link sent to your email!");
        setStep(2);
        setLoading(false);
    }, 1500);
  };

  // ২. পাসওয়ার্ড রিসেট সিমুলেশন
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
        toast.success("Password Updated Successfully!");
        setCurrentView('login');
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-24 px-4 min-h-[80vh]">
        <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row max-w-5xl w-full border border-gray-100">
            
            {/* বাম সাইড: ডিজাইন সেকশন */}
            <div className="md:w-1/2 bg-black p-12 text-white flex flex-col justify-center relative overflow-hidden">
                {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-600 rounded-full -ml-16 -mt-16 opacity-30 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600 rounded-full -mr-16 -mb-16 opacity-20 blur-3xl"></div>
                
                <div className="relative z-10 text-center md:text-left">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto md:mx-0 shadow-lg shadow-red-900/20">
                        <FaShieldAlt />
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-4 unbounded">
                        Account <br /><span className="text-red-600">Recovery.</span>
                    </h2>
                    <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-xs">
                        Don&apos;t worry! It happens. Please follow the steps to regain access to your tech account.
                    </p>
                </div>
            </div>

            {/* ডান সাইড: ফর্ম সেকশন */}
            <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                        {step === 1 ? "Forgot Password?" : "Set New Password"}
                    </h2>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                        {step === 1 ? "Step 01: Identity Verification" : "Step 02: Secure Update"}
                    </p>
                </div>

                {step === 1 ? (
                    /* স্টেজ ১: ইমেইল ইনপুট */
                    <form onSubmit={handleVerifyEmail} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest flex items-center gap-2">
                                <FaEnvelope /> Registered Email
                            </label>
                            <input 
                                type="email" 
                                required 
                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-red-600 transition-all font-bold text-sm" 
                                placeholder="example@mail.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <button 
                            disabled={loading} 
                            className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
                        >
                            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    /* স্টেজ ২: নতুন পাসওয়ার্ড */
                    <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest flex items-center gap-2">
                                <FaLock /> New Secure Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl pr-12 outline-none focus:border-red-600 transition-all font-bold text-sm" 
                                    placeholder="••••••••" 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button 
                            disabled={loading} 
                            className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
                        >
                            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Update Password"}
                        </button>
                    </form>
                )}

                {/* ব্যাক বাটন */}
                <div className="mt-10 pt-6 border-t border-gray-50">
                    <button 
                        onClick={() => setCurrentView('login')} 
                        className="group text-gray-400 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all mx-auto"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                        Back to secure login
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ForgotPasswordView;