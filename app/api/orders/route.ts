import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  total: Number,
  paymentMethod: String,
  status: { type: String, default: "Pending" },
  date: { type: String, default: new Date().toLocaleDateString() }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: unknown) {
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newOrder = await Order.create(body);
    return NextResponse.json({ message: "Order Placed Successfully", order: newOrder }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ message: "Order Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json(updatedOrder);
  } catch (error: unknown) {
    return NextResponse.json({ message: "Status update failed" }, { status: 500 });
  }
}