import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import customRateLimiter from '../lib/customRateLimiter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { prompt, amount, resolution = '1024x1024' } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    if (!amount) {
      return new NextResponse('Amount is required', { status: 400 });
    }

    if (!resolution) {
      return new NextResponse('Resolution is required', { status: 400 });
    }

    // const numberAmount = Number(amount);

    const rateLimitResponse = customRateLimiter('image');
    if (rateLimitResponse) {
      return new NextResponse('Too many requests. Come back in 5 minutes!', {
        status: 400,
      });
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.log('[IMAGE_ERROR]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
