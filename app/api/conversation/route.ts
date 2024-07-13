import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import customRateLimiter from '../lib/customRateLimiter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const user = await currentUser();

    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // console.log(userId, req.headers.get('cookie'));

    // const cookieUser = req.headers.get('cookie');

    const rateLimitResponse = customRateLimiter('conversation');

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
      messages,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (err) {
    console.log('[CONVERSATION_ERROR]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
