import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Product title is required" }, { status: 400 });
        }

        const prompt = `
        You are an expert e-commerce copywriter. I am uploading a gadget named "${title}" to my store.
        Generate highly engaging, conversion-optimized, and SEO-friendly content for it.
        
        You MUST respond ONLY with a valid JSON object. No markdown, no introductory text, just the raw JSON.
        The JSON must have exactly these 4 keys:
        {
            "description": "A professional 3-4 line paragraph explaining why someone should buy this.",
            "keyFeatures": "4 to 5 main technical specifications. Separate each feature with exactly \\n",
            "metaTitle": "SEO-friendly title under 60 characters",
            "metaDescription": "SEO description under 150 characters"
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages:[{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant", // আপডেট করা মডেল
            temperature: 0.5,
            response_format: { type: "json_object" }, 
        });

        const responseText = chatCompletion.choices[0]?.message?.content;
        
        if (!responseText) throw new Error("No response from AI");

        const aiData = JSON.parse(responseText);

        return NextResponse.json(aiData, { status: 200 });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate AI content" }, { status: 500 });
    }
}