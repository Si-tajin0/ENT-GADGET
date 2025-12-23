'use client';

import React from 'react';
import Link from 'next/link';

const ReturnPolicy = () => {
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

      <div className="bg-gray-50 min-h-screen pb-16"> {/* bg-[var(--prim-light)] থেকে bg-gray-50 করা হয়েছে */}
        
        {/* === 1. Hero Section === */}
        <div className="bg-black text-white py-16 text-center px-4"> {/* bg-[var(--prim-color)] থেকে bg-black করা হয়েছে */}
          <h1 className="text-4xl lg:text-5xl font-bold unbounded mb-4">Return & Refund Policy</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Here is how our return process works.
          </p>
        </div>

        <div className="px-[5%] lg:px-[12%] -mt-10">
          
          {/* === 2. Key Highlights Cards === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer"> {/* border-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"> {/* bg-red-50 ও text-red-600 করা হয়েছে */}
                      <i className="bi bi-calendar-check"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">30 Days Return</h3>
                  <p className="text-gray-600 text-sm">You have 30 days from the date of purchase to return your item.</p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer"> {/* border-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"> {/* bg-red-50 ও text-red-600 করা হয়েছে */}
                      <i className="bi bi-box-seam"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Easy Process</h3>
                  <p className="text-gray-600 text-sm">Initiate a return online or visit our store. We make it hassle-free.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer"> {/* border-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"> {/* bg-red-50 ও text-red-600 করা হয়েছে */}
                      <i className="bi bi-cash-coin"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fast Refund</h3>
                  <p className="text-gray-600 text-sm">Get your refund within 5-7 business days after approval.</p>
              </div>
          </div>

          {/* === 3. Detailed Content === */}
          <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm space-y-10">
              
              {/* Section: Eligibility */}
              <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <i className="bi bi-check-circle-fill text-red-600"></i> Eligibility for Returns {/* text-red-600 করা হয়েছে */}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                      To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Product must be unused and in original condition.</li>
                      <li>Original packaging and tags must be intact.</li>
                      <li>Proof of purchase (Order ID or Invoice) is required.</li>
                      <li>Return request must be raised within 30 days.</li>
                  </ul>
              </section>

              <hr className="border-gray-200"/>

              {/* Section: Non-returnable Items */}
              <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <i className="bi bi-x-circle-fill text-red-600"></i> Non-returnable Items {/* text-red-500 থেকে text-red-600 করা হয়েছে */}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                      Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products).
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 text-sm">
                      <strong>Note:</strong> We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
                  </div>
              </section>

              <hr className="border-gray-200"/>

              {/* Section: How to Return */}
              <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <i className="bi bi-arrow-repeat text-red-600"></i> How to Initiate a Return? {/* text-red-600 করা হয়েছে */}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex gap-4 cursor-pointer"> {/* cursor-pointer যোগ করা হয়েছে */}
                          <span className="w-8 h-8 flex-shrink-0 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">1</span>
                          <div>
                              <h4 className="font-bold text-gray-800">Contact Us</h4>
                              <p className="text-sm text-gray-600 mt-1">Email us at <strong>admin@entgadget.com</strong> with your Order ID and reason for return.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 cursor-pointer"> {/* cursor-pointer যোগ করা হয়েছে */}
                          <span className="w-8 h-8 flex-shrink-0 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">2</span>
                          <div>
                              <h4 className="font-bold text-gray-800">Pack the Item</h4>
                              <p className="text-sm text-gray-600 mt-1">Pack the item securely in its original packaging including all accessories.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 cursor-pointer"> {/* cursor-pointer যোগ করা হয়েছে */}
                          <span className="w-8 h-8 flex-shrink-0 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">3</span>
                          <div>
                              <h4 className="font-bold text-gray-800">Ship it Back</h4>
                              <p className="text-sm text-gray-600 mt-1">Send the package to our return address provided in the email.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 cursor-pointer"> {/* cursor-pointer যোগ করা হয়েছে */}
                          <span className="w-8 h-8 flex-shrink-0 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">4</span>
                          <div>
                              <h4 className="font-bold text-gray-800">Get Refund</h4>
                              <p className="text-sm text-gray-600 mt-1">Once inspected, we will process your refund to your original payment method.</p>
                          </div>
                      </div>
                  </div>
              </section>

          </div>

          {/* === 4. Contact CTA === */}
          <div className="mt-12 bg-white rounded-xl p-8 text-center shadow-sm border border-red-600"> {/* border-red-600 করা হয়েছে */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-6">Our support team is available 24/7 to assist you with your returns.</p>
              <Link href="/UI-Components/Pages/contact">
                  <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-black transition-all shadow-md cursor-pointer"> {/* bg-[var(--prim-color)] থেকে bg-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                      Contact Support
                  </button>
              </Link>
          </div>

        </div>
      </div>
    </>
  )
}

export default ReturnPolicy;