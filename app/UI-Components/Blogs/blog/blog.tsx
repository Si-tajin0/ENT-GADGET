'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Gaming: What to Expect in 2025",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    category: "Gaming",
    author: "Admin",
    date: "Oct 24, 2024",
    tags: ["Tech", "Gaming", "AI"],
    excerpt: "Gaming technology is evolving rapidly. From VR advancements to cloud gaming, here is what the future holds for gamers."
  },
  {
    id: 2,
    title: "Top 5 Headphones for Audiophiles",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    category: "Reviews",
    author: "Editor",
    date: "Oct 20, 2024",
    tags: ["Headphone", "Review", "Audio"],
    excerpt: "We reviewed the best headphones in the market. Check out our top picks for the best sound experience."
  },
  {
    id: 3,
    title: "Smart Home Gadgets You Need Today",
    image: "https://images.unsplash.com/photo-1558002038-10915571499f?q=80&w=1000&auto=format&fit=crop",
    category: "Technology",
    author: "Tech Guru",
    date: "Oct 15, 2024",
    tags: ["Smart Home", "Gadgets", "IoT"],
    excerpt: "Upgrade your lifestyle with these smart home devices that bring convenience and security to your doorstep."
  },
  {
    id: 4,
    title: "Apple Watch Series 9 vs Ultra 2",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop",
    category: "Comparison",
    author: "Admin",
    date: "Oct 10, 2024",
    tags: ["Smart Watch", "Apple", "Review"],
    excerpt: "Confused between the two? We break down the specs, features, and price to help you decide."
  },
  {
    id: 5,
    title: "How to Build a Custom PC",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop",
    category: "Tutorial",
    author: "PC Master",
    date: "Oct 05, 2024",
    tags: ["PC Build", "Tutorial", "Tech"],
    excerpt: "A step-by-step guide to building your own powerful desktop computer from scratch."
  },
  {
    id: 6,
    title: "Best Camera Drones under $500",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop",
    category: "Gadgets",
    author: "Fly High",
    date: "Oct 01, 2024",
    tags: ["Drone", "Camera", "Photography"],
    excerpt: "Capture stunning aerial shots without breaking the bank. Here are the best budget-friendly drones."
  },
];

const ITEMS_PER_PAGE = 4;

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ফিল্টারিং লজিক
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // প্যাজিনেশন লজিক
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedTag('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-[var(--prim-light)] min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-[var(--prim-color)] text-white py-16 text-center px-4">
        <h1 className="text-4xl lg:text-5xl font-bold unbounded mb-4">Latest Tech News</h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Stay updated with the latest gadgets, reviews, and tech trends from ENTGadget.
        </p>
      </div>

      <div className="px-[5%] lg:px-[12%] py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
             {/* Filter Status */}
             {(selectedCategory !== 'All' || selectedTag !== '' || searchTerm !== '') && (
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-gray-600 text-sm">
                        Showing results for: 
                        {selectedCategory !== 'All' && <span className="font-bold text-black ml-1">{selectedCategory}</span>}
                        {selectedTag && <span className="font-bold text-black ml-1">#{selectedTag}</span>}
                        {searchTerm && <span className="font-bold text-black ml-1">`&quot`{searchTerm}`&quot`</span>}
                    </p>
                    <button onClick={clearFilters} className="text-red-500 text-sm font-bold hover:underline">Clear Filters</button>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedPosts.length > 0 ? (
                    displayedPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image 
                                    src={post.image} 
                                    alt={post.title} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div 
                                    onClick={() => setSelectedCategory(post.category)}
                                    className="absolute top-4 left-4 bg-[var(--prim-color)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase cursor-pointer hover:bg-black transition"
                                >
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1"><i className="bi bi-person-fill text-[var(--prim-color)]"></i> {post.author}</span>
                                    <span className="flex items-center gap-1"><i className="bi bi-calendar-event text-[var(--prim-color)]"></i> {post.date}</span>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[var(--prim-color)] transition-colors">
                                    {post.title}
                                </h2>
                                
                                <p className="text-gray-600 text-sm line-clamp-3 flex-grow mb-4">
                                    {post.excerpt}
                                </p>

                                <Link href={`/UI-Components/Blogs?id=${post.id}`}>
                                    <button className="text-[var(--prim-color)] font-bold text-sm uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                                        Read More <i className="bi bi-arrow-right"></i>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <i className="bi bi-emoji-frown text-4xl mb-4 block"></i>
                        <p>No posts found. Try different keywords.</p>
                        <button onClick={clearFilters} className="mt-4 text-[var(--prim-color)] font-bold underline">Reset Filters</button>
                    </div>
                )}
             </div>

             {/* Pagination */}
             {totalPages > 1 && (
                 <div className="mt-12 flex justify-center gap-3">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full bg-white text-gray-600 border hover:bg-[var(--prim-color)] hover:text-white transition-all flex items-center justify-center font-bold disabled:opacity-50"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${currentPage === i + 1 ? 'bg-[var(--prim-color)] text-white' : 'bg-white text-gray-600 border hover:bg-[var(--prim-color)] hover:text-white'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full bg-white text-gray-600 border hover:bg-[var(--prim-color)] hover:text-white transition-all flex items-center justify-center font-bold disabled:opacity-50"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                 </div>
             )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-8">
            
            {/* Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Search</h3>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search posts..." 
                        className="w-full p-3 border rounded-lg outline-none focus:border-[var(--prim-color)] bg-gray-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Categories</h3>
                <ul className="space-y-3">
                    {['Gaming', 'Reviews', 'Technology', 'Comparison', 'Tutorial', 'Gadgets'].map((cat, index) => (
                        <li key={index}>
                            <button 
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full flex justify-between items-center transition-colors group ${selectedCategory === cat ? 'text-[var(--prim-color)] font-bold' : 'text-gray-600 hover:text-[var(--prim-color)]'}`}
                            >
                                <span><i className={`bi bi-chevron-right text-xs me-2 transition-opacity ${selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></i> {cat}</span>
                                <span className="bg-gray-100 text-xs px-2 py-1 rounded-full group-hover:bg-[var(--prim-color)] group-hover:text-white transition-colors">{(index + 1) * 2}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Recent Posts</h3>
                <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                        <Link href={`/UI-Components/Blogs?id=${post.id}`} key={post.id}>
                            <div className="flex gap-4 group cursor-pointer mb-4">
                                <div className="w-20 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform" unoptimized/>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[var(--prim-color)] transition-colors">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {['Tech', 'Mobile', 'Laptop', 'AI', 'Smart Watch', 'Headphone', 'Camera'].map((tag, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${selectedTag === tag ? 'bg-[var(--prim-color)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[var(--prim-color)] hover:text-white'}`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default BlogPage;