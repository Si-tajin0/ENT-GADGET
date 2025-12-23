'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// === ডামি ডাটা (BlogList এর সাথে মিল থাকতে হবে) ===
const blogPosts = [
  {
    id: 1,
    title: "The Future of Gaming: What to Expect in 2025",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    category: "Gaming",
    author: "Admin",
    date: "Oct 24, 2024",
    content: "Gaming technology is evolving rapidly. From VR advancements to cloud gaming, the future holds immense potential. We expect to see 8K gaming becoming standard, along with haptic feedback suits for immersive VR experiences. AI will play a huge role in NPC behavior, making open-world games feel more alive than ever before."
  },
  {
    id: 2,
    title: "Top 5 Headphones for Audiophiles",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    category: "Reviews",
    author: "Editor",
    date: "Oct 20, 2024",
    content: "When it comes to sound quality, not all headphones are created equal. In this review, we dive deep into frequency response, soundstage, and impedance. Our top pick for this year is the Sony WH-1000XM5 for its stellar noise cancellation, followed closely by the Sennheiser HD 800 S for pure analytical listening."
  },
  {
    id: 3,
    title: "Smart Home Gadgets You Need Today",
    image: "https://images.unsplash.com/photo-1558002038-10915571499f?q=80&w=1000&auto=format&fit=crop",
    category: "Technology",
    author: "Tech Guru",
    date: "Oct 15, 2024",
    content: "Automating your home is no longer a futuristic dream. With smart plugs, voice assistants, and automated lighting, you can control your entire house with your phone. We recommend starting with a smart hub like Google Nest or Amazon Echo to centralize your devices."
  },
  {
    id: 4,
    title: "Apple Watch Series 9 vs Ultra 2",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop",
    category: "Comparison",
    author: "Admin",
    date: "Oct 10, 2024",
    content: "Choosing between the Series 9 and Ultra 2 depends on your lifestyle. The Ultra 2 offers rugged durability and massive battery life for adventurers, while the Series 9 is sleek, lighter, and perfect for everyday users. Let's compare their sensors and display brightness."
  },
  {
    id: 5,
    title: "How to Build a Custom PC",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop",
    category: "Tutorial",
    author: "PC Master",
    date: "Oct 05, 2024",
    content: "Building a PC is like Lego for adults. First, choose a CPU and compatible motherboard. Don't cheap out on the Power Supply (PSU). In this guide, we walk you through cable management, applying thermal paste correctly, and setting up BIOS for the first time."
  },
  {
    id: 6,
    title: "Best Camera Drones under $500",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop",
    category: "Gadgets",
    author: "Fly High",
    date: "Oct 01, 2024",
    content: "You don't need to spend thousands to get great aerial shots. The DJI Mini 2 SE and Potensic Atom are game changers in the budget market. They offer 4K video, decent flight time, and stable hovering capabilities perfect for beginners."
  },
];

const BlogDetails = ({ id }: { id: string }) => {
  // আইডি দিয়ে নির্দিষ্ট ব্লগ খোঁজা হচ্ছে
  const blog = blogPosts.find((b) => String(b.id) === id);

  if (!blog) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-500">Blog Not Found!</h2>
        <Link href="/UI-Components/Blogs" className="mt-4 px-6 py-2 bg-[var(--prim-color)] text-white rounded-lg">Back to Blogs</Link>
    </div>
  );

  return (
    <div className="bg-[var(--prim-light)] min-h-screen py-10">
      <div className="px-[5%] lg:px-[12%]">
        
        {/* Back Button */}
        <Link href="/UI-Components/Blogs" className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--prim-color)] mb-8 font-bold transition-colors">
            <i className="bi bi-arrow-left"></i> Back to Blog List
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
            
            {/* === Left Side: Blog Content === */}
            <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 md:p-10 border border-gray-200">
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span className="bg-[var(--prim-light)] text-[var(--prim-color)] px-3 py-1 rounded-full font-bold uppercase text-xs">
                            {blog.category}
                        </span>
                        <span className="flex items-center gap-1"><i className="bi bi-person-circle"></i> {blog.author}</span>
                        <span className="flex items-center gap-1"><i className="bi bi-calendar3"></i> {blog.date}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 unbounded leading-tight">
                        {blog.title}
                    </h1>

                    {/* Main Image */}
                    <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
                        <Image 
                            src={blog.image} 
                            alt={blog.title} 
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Content Body */}
                    <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
                        <p>{blog.content}</p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. 
                            Distinctio, magni. Eum, voluptatum. Quisquam, voluptatum. Distinctio, magni.
                        </p>
                        <blockquote className="border-l-4 border-[var(--prim-color)] pl-4 italic text-gray-600 my-6 bg-gray-50 p-4 rounded-r-lg">
                            Technology is best when it brings people together. - Matt Mullenweg
                        </blockquote>
                        <p>
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>

                    {/* Social Share */}
                    <div className="border-t border-gray-100 mt-10 pt-6 flex items-center justify-between">
                        <span className="font-bold text-gray-700">Share this post:</span>
                        <div className="flex gap-3">
                            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition"><i className="bi bi-facebook"></i></button>
                            <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition"><i className="bi bi-twitter"></i></button>
                            <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition"><i className="bi bi-whatsapp"></i></button>
                        </div>
                    </div>

                </div>
            </div>

            {/* === Right Side: Sidebar === */}
            <div className="w-full lg:w-1/3 space-y-8">
                
                {/* Recent Posts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Recent Posts</h3>
                    <div className="space-y-4">
                        {/* বর্তমান ব্লগটি বাদ দিয়ে বাকিগুলো দেখাবে */}
                        {blogPosts.filter(p => String(p.id) !== id).slice(0, 3).map((post) => (
                            <Link href={`/UI-Components/Blogs?id=${post.id}`} key={post.id} className="flex gap-4 group">
                                <div className="w-20 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform" unoptimized/>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[var(--prim-color)] transition-colors">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Banner Ad */}
                <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                    <Image src="https://images.unsplash.com/photo-1593642632823-8f78536788c6?q=80&w=1000" alt="Ad" fill className="object-cover group-hover:scale-105 transition-transform" unoptimized/>
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                        <h4 className="text-white text-2xl font-bold mb-2">Summer Sale</h4>
                        <p className="text-white/80 mb-4">Up to 50% Off on Gadgets</p>
                        <Link href="/UI-Components/Shop">
                             <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-[var(--prim-color)] hover:text-white transition-all">Shop Now</button>
                        </Link>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetails;