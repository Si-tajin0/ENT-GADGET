'use client';

import React, { useState, useEffect } from 'react'; // useEffect import করুন
import Link from 'next/link';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isFloatingToolsLoaded, setIsFloatingToolsLoaded] = useState(false); // নতুন স্টেট

  useEffect(() => {
    // এটি নিশ্চিত করবে যে FloatingTools লোড হয়েছে কিনা।
    // এখানে কোনো সুনির্দিষ্ট চেক করা সম্ভব নয় কারণ এটি ভিন্ন কম্পোনেন্ট।
    // তবে, একটি ছোট ডিলে দিয়ে এটি সিমুলেট করা যেতে পারে
    // অথবা FloatingTools এর মধ্যে একটি global state manager (Context/Zustand) ব্যবহার করে
    // এর লোডিং স্টেট ট্র্যাক করা যেতে পারে।
    // আপাতত, একটি ছোট্ট ডিলে দিয়ে এটি ধরছি।
    const checkLoad = setTimeout(() => {
      setIsFloatingToolsLoaded(true);
    }, 500); // 500ms ডিলে
    return () => clearTimeout(checkLoad);
  }, []);


  const faqs = [
    { question: "How do I track my order?", answer: "Once your order is shipped, you will receive a tracking number via email." },
    { question: "What payment methods do you accept?", answer: "We accept Credit/Debit cards, PayPal, bKash, Rocket, and COD." },
    { question: "How can I return a product?", answer: "You can return a product within 30 days of purchase." },
    { question: "Do you offer international shipping?", answer: "Currently, we only ship within Bangladesh." },
    { question: "Can I cancel my order?", answer: "Yes, you can cancel your order before it is shipped." },
    { question: "Is my personal information safe?", answer: "Absolutely. We use SSL encryption for security." }
  ];

  const categories = [
    { icon: 'bi-truck', title: 'Shipping & Delivery' },
    { icon: 'bi-arrow-repeat', title: 'Returns & Refunds' },
    { icon: 'bi-credit-card', title: 'Payments' },
    { icon: 'bi-person-circle', title: 'Account Settings' },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleOpenChat = () => {
    if (isFloatingToolsLoaded) { // নিশ্চিত করুন FloatingTools লোড হয়েছে
      window.dispatchEvent(new Event('openChatbot'));
    } else {
      console.warn("FloatingTools might not be loaded yet. Chatbot may not open.");
      // optionally, fallback to contact page or show a message
      // window.location.href = "/UI-Components/Pages/contact";
    }
  };

  return (
    <>
      {/* গ্লোবাল CSS ভ্যারিয়েবল সেট করা হয়েছে */}
      <style jsx global>{`
        :root {
          --prim-color: #dc2626; /* red-600 */
          --prim-light: #fef2f2; /* red-50 এর কাছাকাছি */
          --text-color-dark: #1f2937; /* gray-800 */
          --text-color-light: #d1d5db; /* gray-400 */
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen pb-20"> 
        
        <div className="bg-black text-white py-20 px-4 text-center relative z-10"> 
          <h1 className="text-4xl lg:text-5xl font-bold unbounded mb-4">How can we help?</h1>
          <p className="text-lg text-white/80 mb-8">Search for answers or browse topics below.</p>
          
          <div className="max-w-2xl mx-auto relative">
              <input 
                  type="text" 
                  placeholder="Type your question here... (e.g., Refund)" 
                  className="w-full p-4 pl-12 rounded-full text-gray-800 bg-white focus:outline-none shadow-lg placeholder:text-gray-400"
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
          </div>
        </div>

        <div className="px-[5%] lg:px-[12%] -mt-10 relative z-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {categories.map((cat, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer group"> 
                      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 group-hover:bg-red-600 group-hover:text-white transition-colors"> 
                          <i className={`bi ${cat.icon}`}></i>
                      </div>
                      <h3 className="font-bold text-gray-800">{cat.title}</h3>
                  </div>
              ))}
          </div>

          <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center unbounded">Frequently Asked Questions</h2>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-100 last:border-none">
                              <button 
                                  onClick={() => toggleFAQ(index)}
                                  className={`w-full text-left p-6 flex justify-between items-center transition-all hover:bg-gray-50 cursor-pointer ${openIndex === index ? 'text-red-600' : 'text-gray-700'}`} 
                              >
                                  <span className="font-bold text-lg">{faq.question}</span>
                                  <i className={`bi bi-chevron-down transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}></i>
                              </button>
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                  <p className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-dashed border-gray-100">
                                      {faq.answer}
                                  </p>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="p-10 text-center text-gray-500">
                          <i className="bi bi-question-circle text-4xl mb-2 block"></i>
                          No results found for &quot;{searchTerm}&quot;.
                      </div>
                  )}
              </div>
          </div>

          <div className="mt-16 bg-white rounded-2xl p-10 text-center shadow-md border border-red-600 flex flex-col md:flex-row items-center justify-between gap-6"> 
              <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Still need help?</h3>
                  <p className="text-gray-600">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
              </div>
              <div className="flex gap-4">
                  <Link href="/UI-Components/Pages/contact">
                      <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-black transition-all shadow-md flex items-center gap-2 cursor-pointer"> 
                          <i className="bi bi-envelope"></i> Contact Us
                      </button>
                  </Link>
                  
                  {/* === Live Chat Button - now dispatches event to FloatingTools === */}
                  <button 
                      onClick={handleOpenChat}
                      className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-50 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                      <i className="bi bi-chat-dots"></i> Live Chat
                  </button>
              </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default HelpCenter;