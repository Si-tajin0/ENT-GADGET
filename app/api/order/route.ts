import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// আইটেমের জন্য ইন্টারফেস
interface OrderItem {
    title: string;
    qty: number;
    price: string | number;
}

// অর্ডারের জন্য ইন্টারফেস
interface OrderRequest {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address: string;
    items: OrderItem[];
    total: string | number;
}

export async function POST(req: Request) {
    try {
        const orderData: OrderRequest = await req.json();

        // ১. ট্রান্সপোর্টার কনফিগারেশন
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // এখানে স্পেস ছাড়া ১৬ অক্ষরের কোড থাকবে
            },
        });

        // কানেকশন চেক করা (টার্মিনালে লগ দেখার জন্য)
        try {
            await transporter.verify();
            console.log("Email Server is Ready!");
        } catch (verifyError: unknown) {
            const errorMsg = verifyError instanceof Error ? verifyError.message : "SMTP Verify Error";
            console.error("Verify Error:", errorMsg);
            return NextResponse.json({ success: false, error: "Email Config Error" }, { status: 500 });
        }

        // প্রোডাক্ট লিস্টের জন্য HTML তৈরি
        const itemsHtml = orderData.items.map((item: OrderItem) => 
            `<li>${item.title} (x${item.qty}) - ৳${item.price}</li>`
        ).join('');

        const emailBody = `
            <h2>New Order Received: ${orderData.id}</h2>
            <p><strong>Customer:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Address:</strong> ${orderData.address}</p>
            <hr/>
            <ul>${itemsHtml}</ul>
            <h3>Total: ৳${orderData.total}</h3>
        `;

        // ২. এডমিনকে মেইল পাঠানো
        await transporter.sendMail({
            from: `"ENT Gadget Store" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL as string,
            subject: `Admin Alert: New Order ${orderData.id}`,
            html: emailBody,
        });

        // ৩. কাস্টমারকে মেইল পাঠানো
        await transporter.sendMail({
            from: `"ENT Gadget Store" <${process.env.EMAIL_USER}>`,
            to: orderData.customerEmail,
            subject: `Order Confirmed: ${orderData.id}`,
            html: `<h3>Dear ${orderData.customerName}, your order has been received.</h3>${emailBody}`,
        });

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown Server Error";
        console.error("Nodemailer Global Error:", errorMessage);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}