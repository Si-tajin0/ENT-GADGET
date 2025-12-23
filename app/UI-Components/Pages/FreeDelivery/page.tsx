'use client';

import React from 'react';
import Link from 'next/link';

const FreeDelivery = () => {
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
          <h1 className="text-4xl lg:text-5xl font-bold unbounded mb-4">Free Delivery Policy</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Shop more and save on shipping costs. Check out our eligibility criteria below.
          </p>
        </div>

        <div className="px-[5%] lg:px-[12%] -mt-10">
          
          {/* === 2. Conditions Cards === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Condition 1 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer"> {/* border-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"> {/* bg-red-50 ও text-red-600 করা হয়েছে */}
                      <i className="bi bi-cart-check-fill"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Order Above ৳5,000</h3>
                  <p className="text-gray-600 text-sm">Place an order totaling more than 5,000 BDT to qualify for free shipping.</p>
              </div>
              
              {/* Condition 2 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer"> {/* border-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"> {/* bg-red-50 ও text-red-600 করা হয়েছে */}
                      <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Inside Dhaka City</h3>
                  <p className="text-gray-600 text-sm">Free delivery is currently available primarily for Dhaka Metropolitan areas.</p>
              </div>

              {/* Condition 3 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-red-600 text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer"> {/* border-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"> {/* bg-red-50 ও text-red-600 করা হয়েছে */}
                      <i className="bi bi-tags-fill"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Selected Items</h3>
                  <p className="text-gray-600 text-sm">Look for the &quot;Free Shipping&quot; badge on specific promotional products.</p>
              </div>
          </div>

          {/* === 3. Detailed Rules Section === */}
          <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm space-y-8">
              
              <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <i className="bi bi-info-circle-fill text-red-600"></i> Delivery Charges Breakdown {/* text-red-600 করা হয়েছে */}
                  </h2>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-gray-100 text-gray-700">
                                  <th className="p-4 border">Order Value</th>
                                  <th className="p-4 border">Inside Dhaka</th>
                                  <th className="p-4 border">Outside Dhaka</th>
                              </tr>
                          </thead>
                          <tbody className="text-gray-600">
                              <tr>
                                  <td className="p-4 border">Below ৳5,000</td>
                                  <td className="p-4 border font-bold text-gray-800">৳100</td> {/* ৳60 থেকে ৳100 করা হয়েছে */}
                                  <td className="p-4 border font-bold text-gray-800">৳150</td> {/* ৳120 থেকে ৳150 করা হয়েছে */}
                              </tr>
                              <tr className="bg-green-50">
                                  <td className="p-4 border font-bold text-green-700">Above ৳5,000</td>
                                  <td className="p-4 border font-bold text-green-700">FREE</td>
                                  <td className="p-4 border font-bold text-gray-800">৳100 (Discounted)</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </section>

              <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                      <li>Free delivery offer is valid for standard shipping only (Express shipping charges apply).</li>
                      <li>For heavy appliances (AC, Fridge, Washing Machine), extra handling charges may apply even if the order value is above 5,000 BDT.</li>
                      <li>The offer is subject to change during special campaigns like Black Friday or Eid Sales.</li>
                      <li>If you return a product that qualified for free shipping, the shipping cost may be deducted from your refund.</li>
                  </ul>
              </section>

              <section className="bg-red-50 p-6 rounded-xl border border-red-600"> {/* bg-[var(--prim-light)] থেকে bg-red-50 ও border-red-600 করা হয়েছে */}
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Still have questions?</h2>
                  <p className="text-gray-600 mb-4">
                      If you are unsure about the shipping cost for your location, please contact our support team.
                  </p>
                  <Link href="/UI-Components/Pages/contact">
                      <button className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-black transition-all shadow-sm cursor-pointer"> {/* bg-[var(--prim-color)] থেকে bg-red-600 ও cursor-pointer যোগ করা হয়েছে */}
                          Contact Us
                      </button>
                  </Link>
              </section>

          </div>
        </div>
      </div>
    </>
  )
}

export default FreeDelivery;