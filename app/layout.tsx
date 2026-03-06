import type { Metadata } from "next";
import { Geist, Geist_Mono, Merienda, Unbounded } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer/Footer";
import FloatingTools from "./UI-Components/FloatingTools/FloatingTools";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display:'swap',
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
  display:'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENT Gadget | Premium Tech & Gadget Store in Bangladesh",
  description: "Buy premium mobile phones, smartwatches, earbuds, gaming consoles, and tech accessories at the best price in Bangladesh. 🔥 Best Deals & Fast Delivery!",
  keywords:["ENT Gadget", "Gadget Shop Bangladesh", "Buy Mobile BD", "Smartwatch price in BD", "Premium Tech Shop"],
  openGraph: {
    title: "ENT Gadget | Premium Tech & Gadget Store",
    description: "Buy premium mobile phones, smartwatches, and tech accessories at the best price in Bangladesh.",
    url: "https://entgadgetbd.com",
    siteName: "ENT Gadget",
    images:[
      {
        url: "/icon.png", // আপনার ওই লোগোটা সোশ্যাল মিডিয়ায় শেয়ার করলে দেখাবে
        width: 512,
        height: 512,
        alt: "ENT Gadget Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${merienda.variable}`}
      >
        <Navbar/>
        {children}
        <Footer/>

        <Toaster position="top-right" reverseOrder={false}/>
        <FloatingTools/>
      </body>
    </html>
  );
}
