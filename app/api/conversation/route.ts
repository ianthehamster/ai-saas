import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const user = await currentUser(); // USE THIS FOR CREATING NEW USER IN DB

    try {
      const response = await axios.post(`http://localhost:3001/users`, {
        first_name: 'test',
        last_name: 'testLastName',
        email: 'testemail@gmail.com',
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    console.log(
      user?.firstName,
      user?.lastName,
      user?.emailAddresses[0].emailAddress,
    );

    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // if (!openai.apiKey) {
    //   return new NextResponse('OpenAI API Key is not configured', {
    //     status: 500,
    //   });
    // }

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
