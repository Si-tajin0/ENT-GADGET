import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  lessPrice: { type: String },
  image: { type: String, required: true },
  
  // কোন সেকশনে যাবে (Best Deals / Top Selling ইত্যাদি)
  section: { 
    type: String, 
    required: true, 
    enum: ['BestDeals', 'TopSelling', 'HotDeals', 'NewArrivals', 'Featured'] 
  },

  category: { type: String }, // e.g. Smart Watch, Earbuds
  sale: { type: String },     // New, 50% Off
  review: { type: String },
  sold: { type: String },
  
  // অতিরিক্ত ডিটেইলস
  fastCharging: { type: String },
  Wireless: { type: String },
  waterResistant: { type: String },
  description: { type: String },
  keyFeatures: { type: [String] }, // Array of strings
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);