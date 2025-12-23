import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    const query = section && section !== 'All' ? { section } : {};

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Error fetching products", error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newProduct = await Product.create(body);
    return NextResponse.json({ message: "Product Added Successfully", product: newProduct }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Error adding product", error: errorMessage }, { status: 500 });
  }
}