'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import {
  ArrowRight,
  Code,
  Image,
  MessageSquare,
  Music,
  User,
  VideoIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, currentUser, getAuth } from '@clerk/nextjs/server';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    href: '/conversation',
  },
  {
    label: 'Music Generation',
    icon: Music,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    href: '/music',
  },
  {
    label: 'Image Generation',
    icon: Image,
    color: 'text-pink-700',
    bgColor: 'bg-pink-700/10',
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: 'text-orange-700',
    bgColor: 'bg-orange-700/10',
    href: '/video',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    href: '/code',
  },
  {
    label: 'Saved Chats',
    icon: User,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    href: '/user',
  },
];

const DashboardPage = () => {
  const router = useRouter();
  const useUserObject = useUser();
  const [doesUserExist, setDoesUserExist] = useState<boolean | null>(null);

  const userEmail = useUserObject.user?.primaryEmailAddress?.emailAddress;
  const firstName = useUserObject.user?.firstName;
  const lastName = useUserObject.user?.lastName;
  console.log(useUserObject.user?.primaryEmailAddress?.emailAddress);
  console.log(useUserObject.user?.firstName);
  console.log(useUserObject.user?.lastName);

  const checkIfUserExists = async () => {
    try {
      const allUsers = await axios.get(`http://localhost:3001/users`);

      console.log(allUsers.data);

      for (let i = 0; i < allUsers.data.length; i++) {
        const currentUser = allUsers.data[i];
        if (currentUser.email === userEmail) {
          setDoesUserExist(true);
        } else {
          setDoesUserExist(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const postUser = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/users`, {
        first_name: useUserObject.user?.firstName,
        last_name: useUserObject.user?.lastName,
        email: useUserObject.user?.primaryEmailAddress?.emailAddress,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfUserExists();
  }, []);

  useEffect(() => {
    if (doesUserExist === false && userEmail !== null) {
      console.log('POST THE USER!');
      postUser();
    }
  }, [doesUserExist]);

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                <tool.icon className={cn('w-8 h-8', tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
