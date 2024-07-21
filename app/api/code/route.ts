import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import customRateLimiter from '../lib/customRateLimiter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: ChatCompletionMessageParam = {
  role: 'system',
  content:
    'You are a code generator. You must answer in markdown code snippets. Also explain the code in a separate non-markdown part.',
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rateLimitResponse = customRateLimiter('code');

    console.log('rateLimitResponse is ', rateLimitResponse);
    if (rateLimitResponse) {
      return new NextResponse('Too many requests. Come back in 5 minutes!', {
        status: 400,
      });
    }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [instructionMessage, ...messages],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (err) {
    console.log('[CODE_ERROR]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
