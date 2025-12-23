'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// কম্পোনেন্ট ইমপোর্ট (নিশ্চিত করুন পাথ ঠিক আছে)
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import ForgotPasswordView from './components/ForgotPasswordView';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

// === 1. টাইপ ডেফিনিশন (Fix for 'any' error) ===
export interface User {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  role?: 'user' | 'admin';
}

export type ViewState = 'login' | 'signup' | 'account' | 'forgot-password' | 'admin-dashboard';

const AuthPage = () => {
  // টাইপসহ স্টেট ডিক্লেয়ারেশন
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // === 2. useEffect Fix (setTimeout ব্যবহার করে) ===
  useEffect(() => {
    const timer = setTimeout(() => {
        setMounted(true);
        
        // লোকাল স্টোরেজ চেক
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser) as User;
                setUser(parsedUser);
                
                // রোল চেক করে রিডাইরেক্ট
                if(parsedUser.role === 'admin') {
                    setCurrentView('admin-dashboard');
                } else {
                    setCurrentView('account');
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                // ডাটা করাপ্ট হলে লগআউট
                localStorage.removeItem('currentUser');
            }
        }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentView('login');
    
    // ইভেন্ট ফায়ার
    window.dispatchEvent(new Event("authUpdate"));
    window.dispatchEvent(new Event("storageUpdate"));
    
    toast.success("Logged out successfully!");
  };

  if (!mounted) return null;

  return (
    <>
      {currentView === 'login' && (
        <LoginView 
            setCurrentView={setCurrentView} 
            setUser={setUser} 
        />
      )}
      
      {currentView === 'signup' && (
        <SignupView 
            setCurrentView={setCurrentView} 
        />
      )}
      
      {currentView === 'forgot-password' && (
        <ForgotPasswordView 
            setCurrentView={setCurrentView} 
        />
      )}
      
      {currentView === 'account' && (
        <UserDashboard 
            user={user} 
            handleLogout={handleLogout} 
        />
      )}
      
      {currentView === 'admin-dashboard' && (
        <AdminDashboard 
            handleLogout={handleLogout} 
        />
      )}
    </>
  );
};

export default AuthPage;