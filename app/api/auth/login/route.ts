import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // ১. ইউজার খুঁজে বের করা
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // ২. পাসওয়ার্ড চেক করা
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // ৩. সাকসেস (আপনি চাইলে এখানে রোল চেক করতে পারেন)
    return NextResponse.json({ 
      success: true, 
      user: { name: user.name, email: user.email, role: user.role } 
    });

  } catch (error) {
    return NextResponse.json({ message: "Login error" }, { status: 500 });
  }
}