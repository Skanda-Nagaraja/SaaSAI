import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { message } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 });
        }

        if (!message) {
            return new NextResponse("Message is required", { status: 400 });
        }

        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: message,
            max_tokens: 100, // Example, adjust as needed
        });

        // Handle the response here
        return new NextResponse(JSON.stringify(response.data), { status: 200 });

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
