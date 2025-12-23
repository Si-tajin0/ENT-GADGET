'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ইমেজ ইমপোর্ট (আপনার প্রোজেক্টের ইমেজ পাথ অনুযায়ী পরিবর্তন করবেন)
// ডেমো ইমেজের জন্য আমি প্লেসহোল্ডার ব্যবহার করছি
import aboutImg from '@/public/images/about-us.jpg'; // এই নামে একটি ইমেজ public/images ফোল্ডারে রাখবেন
import team1 from '@/public/images/team-1.jpg';
import team2 from '@/public/images/team-2.jpg';
import team3 from '@/public/images/team-3.jpg';

const About = () => {
  
  const features = [
    {
      icon: 'bi-truck',
      title: 'Fast Delivery',
      desc: 'We ensure lightning-fast delivery within 24-48 hours across the country.',
    },
    {
      icon: 'bi-shield-check',
      title: '100% Authentic',
      desc: 'All our gadgets are 100% original and come with an official warranty.',
    },
    {
      icon: 'bi-headset',
      title: '24/7 Support',
      desc: 'Our support team is always ready to assist you with any query.',
    },
    {
      icon: 'bi-credit-card',
      title: 'Secure Payment',
      desc: 'We provide secure payment gateways including bKash, Card, and COD.',
    },
  ];

  const teamMembers = [
    { name: 'John Doe', role: 'CEO & Founder', image: team1 },
    { name: 'Jane Smith', role: 'Marketing Head', image: team2 },
    { name: 'Robert Brown', role: 'Tech Lead', image: team3 },
  ];

  return (
    <>
      {/* গ্লোবাল CSS ভ্যারিয়েবল সেট করা হয়েছে */}
      <style jsx global>{`
        :root {
          --prim-color: #dc2626; /* red-600 */
          --prim-light: #fef2f2; /* red-50 এর কাছাকাছি */
          --text-color-dark: #1f2937; /* gray-800 */
          --text-color-light: #d1d5db; /* gray-400 */
        }
      `}</style>

      <div className="bg-white min-h-screen">
        
        {/* === 1. Hero Section === */}
        <div className="bg-black text-white py-20 text-center px-4">
          <h1 className="text-4xl lg:text-5xl font-bold unbounded mb-4">About Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We are ENTGadget - Your one-stop destination for the latest and greatest in tech.
          </p>
        </div>

        <div className="px-[5%] lg:px-[12%] py-16 bg-gray-50">
          
          {/* === 2. Our Story Section === */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
              <div className="w-full lg:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                  {/* ইমেজ পাথ যদি না থাকে তবে একটি ধূসর বক্স দেখাবে */}
                  {aboutImg ? (
                     <Image src={aboutImg} alt="About Us" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">About Image</div>
                  )}
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                  <h4 className="text-red-600 font-bold uppercase tracking-wider">Who We Are</h4>
                  <h2 className="text-3xl lg:text-4xl font-bold unbounded text-gray-800">
                      Providing the Best Gadgets Since 2020
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                      ENTGadget started with a simple mission: to make high-quality tech products accessible to everyone. From smartphones to smart home devices, we curate the best products from top brands.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                      We believe in quality, affordability, and exceptional customer service. Our team is passionate about technology and dedicated to helping you find the perfect gadget for your needs.
                  </p>
                  <div className="pt-4">
                      <Link href="/UI-Components/Shop">
                          <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-black transition-all shadow-md cursor-pointer"> {/* cursor-pointer যোগ করা হয়েছে */}
                              Explore Products
                          </button>
                      </Link>
                  </div>
              </div>
          </div>

          {/* === 3. Statistics Section === */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 bg-red-50 p-8 rounded-2xl">
              <div className="text-center">
                  <h3 className="text-4xl font-bold text-red-600">10k+</h3>
                  <p className="text-gray-600 font-medium">Happy Customers</p>
              </div>
              <div className="text-center">
                  <h3 className="text-4xl font-bold text-red-600">500+</h3>
                  <p className="text-gray-600 font-medium">Products Available</p>
              </div>
              <div className="text-center">
                  <h3 className="text-4xl font-bold text-red-600">50+</h3>
                  <p className="text-gray-600 font-medium">Top Brands</p>
              </div>
              <div className="text-center">
                  <h3 className="text-4xl font-bold text-red-600">4.8</h3>
                  <p className="text-gray-600 font-medium">User Rating</p>
              </div>
          </div>

          {/* === 4. Why Choose Us === */}
          <div className="mb-20">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold unbounded text-gray-800 mb-3">Why Choose Us?</h2>
                  <p className="text-gray-500">We offer the best services to ensure your satisfaction.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer"> {/* cursor-pointer যোগ করা হয়েছে */}
                          <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                              <i className={`bi ${feature.icon}`}></i>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* === 5. Our Team (Optional) === */}
          <div>
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold unbounded text-gray-800 mb-3">Meet Our Team</h2>
                  <p className="text-gray-500">The expert minds behind ENTGadget.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                      <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                          <div className="relative h-[300px] w-full bg-gray-200">
                               {/* ইমেজ না থাকলে ডিফল্ট কালার দেখাবে */}
                               {member.image ? (
                                   <Image src={member.image} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                               ) : (
                                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                               )}
                          </div>
                          <div className="p-6 text-center">
                              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                              <p className="text-red-600 font-medium mb-3">{member.role}</p>
                              <div className="flex justify-center gap-3 text-gray-500">
                                  <i className="bi bi-facebook hover:text-red-600 cursor-pointer transition-colors"></i> {/* cursor-pointer যোগ করা হয়েছে */}
                                  <i className="bi bi-twitter hover:text-red-600 cursor-pointer transition-colors"></i> {/* cursor-pointer যোগ করা হয়েছে */}
                                  <i className="bi bi-linkedin hover:text-red-600 cursor-pointer transition-colors"></i> {/* cursor-pointer যোগ করা হয়েছে */}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default About;