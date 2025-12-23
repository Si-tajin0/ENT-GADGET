'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaArrowUp, FaUserAlt } from 'react-icons/fa';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const FloatingTools = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScroll, setShowScroll] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! 👋 I am ENT AI. How can I assist you with gadgets today?", sender: 'bot', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ১. হাইড্রেশন ফিক্স এবং স্ক্রল লজিক
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalHeight) * 100);
      setShowScroll(currentScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);

    // Add event listener for opening chatbot from other components (like HelpCenter)
    const handleOpenChatbotEvent = () => setIsChatOpen(true);
    window.addEventListener('openChatbot', handleOpenChatbotEvent);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('openChatbot', handleOpenChatbotEvent); // Clean up event listener
        clearTimeout(timer);
    };
  }, []);

  // ২. অটো স্ক্রল
  useEffect(() => {
    if (isChatOpen) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ৩. স্মার্ট AI রেসপন্স
  const generateAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/hello|hi|hey/)) return "Hello! Welcome to ENT Gadget. Explore our latest collection of Smartphones, Headphones, and more!";
    if (lowerText.match(/price|cost|discount/)) return "We offer the best prices in Bangladesh! Check our 'Hot Deals' or 'Best Deals' section for ৳ discount.";
    if (lowerText.match(/delivery|ship/)) return "📦 Inside Dhaka: 24-48 Hours (৳100)\n🚚 Outside Dhaka: 3-5 Days (৳150).";
    if (lowerText.match(/return|warranty/)) return "We provide 1 year official warranty and a 7-day easy return policy for any manufacturing defects.";
    if (lowerText.match(/location|address|store/)) return "Our store is located in Chittagong, Bangladesh. You can also order online for home delivery!";
    if (lowerText.match(/contact|phone|number/)) return "Call us at +8801670424702 or email: admin@entgadget.com (9 AM - 10 PM).";
    if (lowerText.match(/pay|bkash|cash/)) return "We accept Cash on Delivery (৳100 advance required) and Full bKash Payment.";
    return "I'm still learning! But our support agent can help you better at +8801670424702.";
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
        const botMsg: Message = {
            id: Date.now() + 1,
            text: generateAIResponse(userMsg.text),
            sender: 'bot',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
    }, 1200);
  };

  if (!mounted) return null;

  // SVG Circle Logic
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">

      {/* --- AI CHAT INTERFACE --- */}
      {isChatOpen && (
        <div className="bg-white w-[320px] md:w-[380px] h-[500px] rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300 origin-bottom-right">
          
          {/* Chat Header */}
          <div className="bg-black p-5 flex justify-between items-center text-white border-b-4 border-red-600">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <FaRobot className="text-xl" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                </div>
                <div>
                    <h4 className="font-black text-xs uppercase tracking-widest leading-none">ENT AI BOT</h4>
                    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Always Online
                    </p>
                </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer">
                <FaTimes />
            </button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-4 scrollbar-hide">
             {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-2 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black shadow-sm ${msg.sender === 'bot' ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>
                        {msg.sender === 'bot' ? <FaRobot /> : <FaUserAlt />}
                    </div>
                    
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                        ? 'bg-black text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                    }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <p className={`text-[8px] mt-1.5 font-black uppercase opacity-40 ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
                    </div>
                 </div>
             ))}

             {isTyping && (
                 <div className="flex gap-2 items-center">
                    <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"><FaRobot /></div>
                    <div className="bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm flex gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-red-600 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1 h-1 bg-red-600 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
             )}
             <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
             <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask ENT Assistant..." 
                className="flex-1 text-xs font-bold outline-none bg-gray-100 px-5 py-3 rounded-full text-gray-800 focus:ring-2 focus:ring-red-600/10 transition-all border border-transparent focus:border-red-600/20" 
             />
             <button type="submit" className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-90 cursor-pointer">
                <FaPaperPlane className="text-xs" />
             </button>
          </form>
        </div>
      )}

      {/* --- SCROLL TO TOP (FANCY) --- */}
      <div className={`transition-all duration-500 ease-in-out ${showScroll ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10'}`}>
        <button
          onClick={scrollToTop}
          className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-2xl group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <svg className="absolute top-0 left-0 w-full h-full -rotate-90 transform p-1" width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="4" />
            <circle 
                cx="28" cy="28" r={radius} fill="none" 
                stroke="#DC2626" strokeWidth="4" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                className="transition-all duration-500 ease-out" 
            />
          </svg>
          <FaArrowUp className="text-lg text-red-600 group-hover:text-black transition-colors z-10" />
        </button>
      </div>

      {/* --- CHAT TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative transition-all duration-500 hover:scale-110 active:scale-90 cursor-pointer
        ${isChatOpen ? 'bg-black rotate-180' : 'bg-red-600 hover:rotate-12'}
        `}
      >
        {isChatOpen ? <FaTimes className="text-2xl text-white" /> : (
            <>
             <FaRobot className="text-3xl text-white" />
             <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-black border-2 border-red-600"></span>
             </span>
            </>
        )}
      </button>

    </div>
  );
};

export default FloatingTools;