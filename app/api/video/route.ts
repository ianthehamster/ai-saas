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

    console.log(user);

    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const input = {
      fps: 24,
      width: 1024,
      height: 576,
      prompt: prompt,
      guidance_scale: 17.5,
      negative_prompt:
        'very blue, dust, noisy, washed out, ugly, distorted, broken',
    };

    const response = await replicate.run(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      { input },
    );

    return NextResponse.json(response);
  } catch (err) {
    console.log('[VIDEO_ERROR]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
