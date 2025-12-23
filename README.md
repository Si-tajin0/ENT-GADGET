# 🚀 ENT Gadget - Premium Tech E-commerce Store

**ENT Gadget** is a high-end, fully functional e-commerce platform built for tech enthusiasts. It offers a seamless shopping experience with a modern UI, real-time database synchronization, and professional order management systems.

🌐 **Live Demo:** [https://www.entgadgetbd.com/](https://www.entgadgetbd.com/)

---

## ✨ Key Features

### 🛒 User Experience
- **Premium UI:** Built with a "Red & Black" luxury theme using the **Unbounded** typeface.
- **Dynamic Shopping Cart:** Add products from both local JSON and MongoDB database without any duplication.
- **Persistent Wishlist:** Save your favorite gadgets for later.
- **Smart Search:** Search products across all categories with instant dropdown results.
- **Real-time Tracking:** Users can track their order status (Pending → Processing → Shipped → Delivered) directly from their dashboard.

### 💳 Advanced Checkout System
- **Location-based Shipping:** Automatic delivery charge calculation (৳100 for Dhaka, ৳150 outside).
- **Coupon System:** Apply promo codes (e.g., `ENTFREE`) for free delivery.
- **COD Advance Logic:** Special condition for Cash on Delivery requiring ৳100 advance payment with TxnID verification.
- **Digital Invoice:** Professional automated invoice generation with a "Download/Print PDF" option.

### 🛡️ Admin & Backend
- **Admin Dashboard:** Robust panel to upload products, manage stock, and update order statuses in real-time.
- **Email Notifications:** Professional HTML email invoices sent to both Admin and Customer via **Nodemailer**.
- **Secure Authentication:** Custom Login/Signup system with role-based access (Admin/User).
- **Image Hosting:** Integrated with **ImgBB API** for fast and reliable image storage.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** MongoDB (Atlas) with Mongoose
- **Styling:** Tailwind CSS
- **Icons:** React Icons & Bootstrap Icons
- **Animations:** Swiper.js & Framer Motion (Transitions)
- **Mailing:** Nodemailer (SMTP)

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following variables to your `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=your_admin_receiver_email
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_ADMIN_WHATSAPP=your_whatsapp_number
