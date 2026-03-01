import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Slider from '@/models/Slider'; // আপনার মডেলের পাথ ঠিক করে নেবেন
import dbConnect from "@/lib/db"; // আপনার ডাটাবেস কানেকশন ফাইল

export async function GET() {
    try {
        await dbConnect();
        // নতুন ব্যানারগুলো আগে দেখানোর জন্য sort({ createdAt: -1 }) দেওয়া হয়েছে
        const sliders = await Slider.find({}).sort({ createdAt: -1 });
        return NextResponse.json(sliders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sliders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        
        const newSlider = await Slider.create(body);
        return NextResponse.json({ success: true, data: newSlider }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create slider' }, { status: 500 });
    }
}

// === নতুন DELETE লজিক ===
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // URL থেকে id নিবে

        if (!id) {
            return NextResponse.json({ error: 'Slider ID is required' }, { status: 400 });
        }

        await Slider.findByIdAndDelete(id); // ডাটাবেস থেকে ডিলিট করবে
        
        return NextResponse.json({ success: true, message: 'Slider deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete slider' }, { status: 500 });
    }
}

// === নতুন UPDATE (PATCH) লজিক ===
export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        
        // _id এবং আপডেট করার ডাটা আলাদা করছি
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ error: 'Slider ID is required' }, { status: 400 });
        }

        // ডাটাবেসে ওই ID এর স্লাইডারটি আপডেট করছি
        const updatedSlider = await Slider.findByIdAndUpdate(_id, updateData, { new: true });
        
        return NextResponse.json({ success: true, data: updatedSlider }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update slider' }, { status: 500 });
    }
}