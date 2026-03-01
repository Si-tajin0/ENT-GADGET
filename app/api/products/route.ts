import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from "@/lib/db"; 

// Product Schema (যদি আপনার মডেলে আগে থেকে না থাকে)
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    lessPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true }, // ImgBB URL
    section: { type: String, required: true }, // TopSelling, BestDeals, NewArrivals
    sale: { type: String }, // e.g., "New", "-20%"
    description: { type: String },
    keyFeatures: { type: [String] }, // Array of features
    metaTitle: { type: String },
    metaDescription: { type: String },
    stock: { type: Number, default: 10 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// GET: সেকশন অনুযায়ী প্রোডাক্ট পাঠানোর লজিক
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const section = searchParams.get('section');

        let query = {};
        // যদি URL এ সেকশন বলা থাকে (যেমন: /api/products?section=TopSelling)
        if (section && section !== 'all') {
            query = { section: section };
        }

        // .sort({ createdAt: -1 }) মানে হলো যেটা আজকে আপলোড করবেন, সেটা ১ নম্বরে দেখাবে!
        const products = await Product.find(query).sort({ createdAt: -1 });
        
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: নতুন প্রোডাক্ট সেভ করার লজিক
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        
        // Price string থাকলে Number এ কনভার্ট করা
        const formattedBody = {
            ...body,
            price: Number(body.price),
            lessPrice: Number(body.lessPrice || 0)
        };

        const newProduct = await Product.create(formattedBody);
        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload product' }, { status: 500 });
    }
}