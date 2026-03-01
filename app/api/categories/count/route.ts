import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Product from '@/models/product'; 

// ১. MongoDB থেকে আসা ডেটার টাইপ ডিফাইন করা হলো
interface CategoryCount {
    _id: string;
    count: number;
}

export async function GET() {
    try {
        await dbConnect();
        
        // MongoDB Aggregation (খুবই ফাস্ট!)
        const counts: CategoryCount[] = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // ২. any টাইপ সরিয়ে সঠিক টাইপ (Record<string, number>) ব্যবহার করা হলো
        const countMap = counts.reduce((acc: Record<string, number>, curr: CategoryCount) => {
            if (curr._id) { // যদি কোনো প্রোডাক্টে ক্যাটাগরি ফাঁকা থাকে, সেটা স্কিপ করবে
                acc[curr._id] = curr.count;
            }
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json(countMap, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch category counts' }, { status: 500 });
    }
}