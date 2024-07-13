import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

const rateLimit = new Map<string, { count: number; timestamp: number }>();

export default function customRateLimiter(reqType: string) {
  const { userId } = auth();

  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const currentTime = Date.now();
  const rateLimitWindow = 5 * 60 * 1000; // 5 minutes window
  let maxRequests;

  if (reqType === 'conversation' || reqType === 'code') {
    maxRequests = 5;
  } else if (reqType === 'image') {
    maxRequests = 3;
  } else {
    maxRequests = 2;
  }

  console.log(maxRequests);

  if (!rateLimit.has(userId)) {
    console.log('has method works');
    rateLimit.set(userId, { count: 2, timestamp: currentTime });
  } else {
    const { count, timestamp } = rateLimit.get(userId)!; // ! is added as a non-null assertion operator, telling Typescript I am absolutely sure count and timestamp is NOT null

    if (currentTime - timestamp < rateLimitWindow) {
      if (count >= maxRequests) {
        return NextResponse.json({
          messsage: 'Too many requests, please try again later.',
        });
      }

      rateLimit.set(userId, { count: count + 1, timestamp });
    } else {
      rateLimit.set(userId, { count: 2, timestamp: currentTime });
    }
  }

  return null;
}
