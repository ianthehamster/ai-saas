import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const user = await currentUser(); // USE THIS FOR CREATING NEW USER IN DB

    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // if (!openai.apiKey) {
    //   return new NextResponse('OpenAI API Key is not configured', {
    //     status: 500,
    //   });
    // }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const input = {
      prompt_b: prompt,
    };

    const response = await replicate.run(
      'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05',
      { input },
    );

    return NextResponse.json(response);
  } catch (err) {
    console.log('[MUSIC_ERROR]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
