'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Blog from './blog/blog';       // ধাপ ২ এ এটি বানাবো
import BlogDetails from './blogDetails/blogDetails'; // ধাপ ৩ এ এটি বানাবো

const BlogsController = () => {
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id'); // URL থেকে id নিবে

  return (
    <div className="min-h-screen bg-[var(--prim-light)]">
      {/* লজিক: যদি id থাকে তাহলে ডিটেইলস, না থাকলে লিস্ট */}
      {blogId ? (
        <BlogDetails id={blogId} />
      ) : (
        <Blog />
      )}
    </div>
  );
};

// Next.js এ useSearchParams ব্যবহার করলে Suspense দিতে হয়
const Page = () => {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Blogs...</div>}>
      <BlogsController />
    </Suspense>
  );
}

export default Page;