import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from 'nodemailer';

// ১. টাইপ ইন্টারফেসসমূহ
interface OrderItem {
    title: string;
    qty: number;
    price: string | number;
}

interface OrderRequest {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: string;
    paymentMethod: string;
    txnId: string;
    items: OrderItem[];
    subTotal: number;
    deliveryCharge: number;
    advancePaid: number;
    total: number;
}

// ২. সব অর্ডার পাওয়ার জন্য (GET)
export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error: unknown) {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}

// ৩. নতুন অর্ডার তৈরি এবং প্রফেশনাল ইমেইল পাঠানো (POST)
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body: OrderRequest = await req.json();
        const newOrder = await Order.create(body);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { 
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        // প্রোডাক্ট টেবিল রো তৈরি করা
        const itemsHtml = body.items.map((item: OrderItem) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: left;">${item.title}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px; color: #333;">${item.qty}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; font-weight: bold; color: #000;">৳${String(item.price).replace(/[^0-9.]/g, "")}</td>
            </tr>
        `).join('');

        // মডার্ন ইমেইল টেমপ্লেট (HTML)
        const emailBody = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <!-- Header -->
                <div style="background-color: #000000; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">ENT GADGET</h1>
                    <p style="color: #ff3333; margin: 5px 0 0; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order Invoice</p>
                </div>
                
                <div style="padding: 30px;">
                    <p style="font-size: 15px; color: #555;">Hello <strong>${body.customerName}</strong>,</p>
                    <p style="font-size: 14px; color: #777; line-height: 1.5;">Thank you for your order! Your request has been received and is now being processed. Here is your summary:</p>

                    <!-- Order Detail Box -->
                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <table style="width: 100%; font-size: 13px; color: #444;">
                            <tr>
                                <td style="padding-bottom: 8px;"><strong>Order ID:</strong></td>
                                <td style="padding-bottom: 8px; text-align: right;">${body.id}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px;"><strong>Phone:</strong></td>
                                <td style="padding-bottom: 8px; text-align: right;">${body.customerPhone}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px;"><strong>Shipping Address:</strong></td>
                                <td style="padding-bottom: 8px; text-align: right;">${body.address}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px;"><strong>Payment Method:</strong></td>
                                <td style="padding-bottom: 8px; text-align: right;">${body.paymentMethod}</td>
                            </tr>
                            <tr>
                                <td><strong>Transaction ID:</strong></td>
                                <td style="text-align: right; color: #d32f2f; font-weight: bold;">${body.txnId}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Items Table -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #ddd;">Product</th>
                                <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #ddd;">Qty</th>
                                <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <!-- Totals Block -->
                    <div style="margin-top: 20px; text-align: right;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #888; font-size: 14px; text-align: right;">Subtotal:</td>
                                <td style="padding: 5px 10px 5px 0; font-weight: bold; width: 120px; text-align: right;">৳${body.subTotal}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #888; font-size: 14px; text-align: right;">Delivery Charge:</td>
                                <td style="padding: 5px 10px 5px 0; font-weight: bold; text-align: right;">৳${body.deliveryCharge}</td>
                            </tr>
                            ${body.advancePaid > 0 ? `
                            <tr>
                                <td style="padding: 5px 0; color: #2e7d32; font-size: 14px; text-align: right;">Advance Paid:</td>
                                <td style="padding: 5px 10px 5px 0; font-weight: bold; color: #2e7d32; text-align: right;">- ৳${body.advancePaid}</td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding: 15px 0 5px; font-size: 18px; font-weight: bold; border-top: 2px solid #333; text-align: right;">Total Due:</td>
                                <td style="padding: 15px 10px 5px 0; font-size: 20px; font-weight: bold; color: #d32f2f; border-top: 2px solid #333; text-align: right;">৳${body.total}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f4f4f4; padding: 25px; text-align: center; font-size: 12px; color: #999;">
                    <p style="margin: 0; font-weight: bold; color: #555;">Thanks for choosing ENT GADGET!</p>
                    <p style="margin: 5px 0;">Akbar Shah, City Gate, Chittagong, Bangladesh</p>
                    <p style="margin: 10px 0 0;">© ${new Date().getFullYear()} ENT GADGET. All Rights Reserved.</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"ENT Gadget Store" <${process.env.EMAIL_USER}>`,
            to: [process.env.ADMIN_EMAIL as string, body.customerEmail],
            subject: `New Order Confirmation - ${body.id}`,
            html: emailBody
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

// ৪. স্ট্যাটাস আপডেট করার জন্য (PATCH)
export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const { id, status }: { id: string, status: string } = await req.json();
        
        // id অনুযায়ী ডাটাবেস আপডেট
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        
        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        
        return NextResponse.json(updatedOrder);
    } catch (error: unknown) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}