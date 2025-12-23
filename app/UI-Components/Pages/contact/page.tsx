'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Make sure you have react-hot-toast installed

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // সিমুলেটেড ফর্ম সাবমিশন
    setTimeout(() => {
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // ফর্ম রিসেট
      setLoading(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: 'bi-geo-alt-fill',
      title: 'Our Location',
      text: 'Akabar sha, City Gate, Chittagonj, Bangladesh.',
    },
    {
      icon: 'bi-telephone-fill',
      title: 'Phone Number',
      text: '(+88)-01670424702',
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Email Address',
      text: 'admin@entgadget.com',
    },
    {
      icon: 'bi-clock-fill',
      title: 'Working Hours',
      text: 'Mon - Fri: 9:00 AM - 10:00 PM',
    },
  ];

  return (
    // <style jsx global> ব্লকটি সরানো হয়েছে
    <div className="bg-gray-50 min-h-screen"> 
      
      {/* === Header Section === */}
      <div className="bg-black text-white py-16 text-center px-4">
        <h1 className="text-4xl lg:text-5xl font-bold unbounded mb-4">Get In Touch</h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Have any questions or need help? We are here to assist you. Fill out the form or reach us via phone or email.
        </p>
      </div>

      <div className="px-[5%] lg:px-[12%] py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* === Left Side: Contact Info === */}
          <div className="w-full lg:w-1/3 space-y-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* === Right Side: Contact Form === */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 unbounded text-gray-800">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      placeholder="John Doe"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-red-600 bg-gray-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="email@example.com"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-red-600 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    placeholder="How can we help?"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-red-600 bg-gray-50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Message</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    placeholder="Write your message here..."
                    rows={5}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-red-600 bg-gray-50 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-black transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Sending...' : <>Send Message <i className="bi bi-send-fill"></i></>}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* === Map Section === */}
      <div className="w-full h-[400px] bg-gray-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.844445836474!2d91.7831813149603!3d22.35957898529241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd901b0b5711d%3A0x6b45e23e20790d97!2sCity%20Gate%2C%20Chattogram!5e0!3m2!1sen!2sbd!4v1679234567890!5m2!1sen!2sbd" 
          width="100%" 
          height="100%" 
          style={{border:0}} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </div>
  )
}

export default Contact;