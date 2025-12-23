'use client'

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

// Images
import paymet from '@/public/images/payment.png'
// === REMOVED BACKGROUND IMAGE IMPORT ===
// import backgroundImage from '@/public/images/footer-new-bg.png' 

const Footer = () => {
  
  const footerLinks = [
    {
      title: "Gadgets Store",
      links: [
        { name: "All Products", href: "/UI-Components/Shop" },
        { name: "Smartphones", href: "/UI-Components/Shop?category=Mobile Phone" },
        { name: "Smart Watches", href: "/UI-Components/Shop?category=Smart Watch" },
        { name: "Audio & Headphones", href: "/UI-Components/Shop?category=Headphone" },
        { name: "Gaming Consoles", href: "/UI-Components/Shop?category=Gaming Console" },
      ]
    },
    {
      title: "Support Center",
      links: [
        { name: "Track Order", href: "/UI-Components/Pages/account" },
        { name: "Help Center", href: "/UI-Components/Pages/HelpCenter" },
        { name: "Return Policy", href: "/UI-Components/Pages/ReturnPolicy" },
        { name: "Terms & Conditions", href: "#" },
        { name: "Privacy Policy", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/UI-Components/Pages/About" },
        { name: "Contact Us", href: "/UI-Components/Pages/contact" },
        { name: "Our Showrooms", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Brand Partners", href: "#" },
      ]
    }
  ];

  return (
    <footer 
        className="relative px-[5%] lg:px-[12%] pt-20 pb-10 text-white bg-black overflow-hidden border-t-4 border-red-600"
        // === CHANGED: Removed backgroundImage and directly used bg-black from className ===
        // style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* মডার্ন ডার্ক ওভারলে (এখন এটি মূল bg-black এর উপর আসবে না, তবে আপনি যদি আরও গাঢ় করতে চান তবে এটি রাখতে পারেন) */}
      {/* <div className="absolute inset-0 bg-black/90 -z-10"></div> */}
      
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (লাল গ্লো) - এটি এখন আরও দৃশ্যমান হবে */
      }
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-20"></div>

      {/* === Main Container === */}
      <div className="flex flex-col xl:flex-row gap-16 xl:gap-24 relative z-10">
        
        {/* --- Left Side: Brand & Contact --- */}
        <div className="flex flex-col gap-8 w-full xl:w-1/3">
            <div>
                <Link href='/' className='text-3xl lg:text-4xl font-black merienda text-white uppercase tracking-tighter'>
                    ENT<span className='text-red-600'>Gadget.</span>
                </Link>
                <div className="w-12 h-1 bg-red-600 mt-2 rounded-full"></div>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm font-medium max-w-sm">
                Elevate your digital lifestyle with ENT Gadget. We bring you the latest, high-performance tech and gadgets with 100% genuine warranty and secure shopping experience.
            </p>

            {/* Contact Details */}
            <div className="flex flex-col gap-5 mt-2">
                <ContactItem icon="bi-geo-alt" text="Akabar Sha, City Gate, Chittagong, BD." />
                <ContactItem icon="bi-telephone" text="+8801670424702" />
                <ContactItem icon="bi-envelope" text="admin@entgadget.com" />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
                <SocialIcon icon="bi-facebook" href="#" />
                <SocialIcon icon="bi-instagram" href="#" />
                <SocialIcon icon="bi-whatsapp" href="https://wa.me/8801670424702" />
                <SocialIcon icon="bi-youtube" href="#" />
            </div>
        </div>

        {/* --- Right Side: Links Grid --- */}
        <div className="w-full xl:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {footerLinks.map((section, index) => (
                <div key={index} className="flex flex-col">
                    <h2 className='unbounded text-xs font-black mb-8 uppercase tracking-[0.2em] text-white border-l-4 border-red-600 pl-3'>
                        {section.title}
                    </h2>
                    <ul className="flex flex-col gap-4">
                        {section.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                                <Link 
                                    href={link.href} 
                                    className='text-gray-400 text-[13px] hover:text-red-600 hover:translate-x-2 transition-all duration-300 inline-block font-bold uppercase tracking-tight'
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            
            {/* Newsletter (Optional 4th column style) */}
            <div className="flex flex-col">
                <h2 className='unbounded text-xs font-black mb-8 uppercase tracking-[0.2em] text-white border-l-4 border-red-600 pl-3'>
                    Newsletter
                </h2>
                <p className="text-gray-400 text-xs font-bold mb-4">Subscribe to get latest tech updates and coupons.</p>
                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 focus-within:border-red-600 transition-all">
                    <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none px-3 text-xs w-full text-white" />
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Join</button>
                </div>
            </div>
        </div>
      </div>

      {/* === Bottom Bar: Copyright & Payment === */}
      <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        
        <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} <span className="text-white font-black">ENT Gadget.</span> Crafted for Tech Enthusiasts.
            </p>
        </div>

        {/* Payment Image Container */}
        <div className="bg-white/5 px-6 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
            <Image 
                src={paymet} 
                alt='Payment Methods' 
                width={280} 
                height={40} 
                className="object-contain grayscale brightness-200"
            />
        </div>
      </div>

    </footer>
  )
}

// Helper Component for Contact Items
const ContactItem = ({ icon, text }: { icon: string, text: string }) => (
    <div className="flex items-center gap-4 group cursor-pointer">
        <div className='w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 border border-white/5 group-hover:border-red-600 shadow-xl shadow-black/20'>
            <i className={`bi ${icon} text-lg`}></i>
        </div>
        <p className="text-gray-400 font-bold text-xs group-hover:text-white transition-colors tracking-tight">
            {text}
        </p>
    </div>
);

// Helper for Social Icons
const SocialIcon = ({ icon, href }: { icon: string, href: string }) => (
    <Link href={href} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:bg-red-600 hover:text-white hover:-translate-y-1 transition-all duration-300">
        <i className={`bi ${icon} text-lg`}></i>
    </Link>
);

export default Footer;