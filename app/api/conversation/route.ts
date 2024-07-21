import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import customRateLimiter from '../lib/customRateLimiter';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const currentlyLoggedInUser = await currentUser();

    const userEmail = currentlyLoggedInUser?.emailAddresses[0].emailAddress;
    const user = await axios.get(
      `http://localhost:3001/users/email?email=${userEmail}`,
    );

    const apiCount = await axios.get(
      `http://localhost:3001/api/users/${user.data.id}`,
    );

    if (user && apiCount.data.count < 5) {
      const increaseApiCountByOne = await axios.put(
        `http://localhost:3001/api/${user.data.id}`,
      );
      // console.log(increaseApiCountByOne);
    } else {
      return new NextResponse('Too many requests. Come back in 5 minutes!', {
        status: 400,
      });
    }

    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rateLimitResponse = await customRateLimiter('conversation');

    console.log('rateLimitResponse is ', rateLimitResponse);
    if (rateLimitResponse) {
      return new NextResponse('Too many requests. Come back in 1 minute!', {
        status: 400,
      });
    }

    // const postApiCountByOne = await axios.put(`http://localhost:3001/api/${userId}`)
    // console.log(postApiCountByOne)

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
