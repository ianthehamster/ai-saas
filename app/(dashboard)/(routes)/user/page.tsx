'use client';

import axios from 'axios';
import * as z from 'zod';
import { Heading } from '@/components/heading';
import { MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { useUser } from '@clerk/nextjs';

const UserPage = () => {
  const router = useRouter();
  const useUserObject = useUser();
  type Message = {
    role: string;
    content: string;
    chat_contents?: any;
    createdAt?: string;
    id?: number;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: '' },
  ]);

  const [geniusUser, setGeniusUser] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = useUserObject.user?.primaryEmailAddress?.emailAddress;

        const loggedInUser = await axios.get(
          `http://localhost:3001/users/email?email=${email}`,
        );

        setGeniusUser(loggedInUser.data);

        if (loggedInUser.data.id) {
          const allMessages = await axios.get(
            `http://localhost:3001/chats/saved/${loggedInUser.data.id}`,
          );
          setMessages(allMessages.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Heading
        title="Your Saved Chats"
        description="Read or delete your saved chats here."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <h3 className="text-center font-bold rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm">
            {useUserObject.user?.firstName}&apos;s Chats
          </h3>
        </div>

        <div>
          {messages.length > 1 ? (
            messages.slice(1).map((message) => {
              const slicedCreatedAt = message.createdAt.split('T')[0];
              return (
                <div
                  key={message.createdAt}
                  className="p-8 border border-black/10"
                >
                  <div className="flex justify-between w-full">
                    <span className="font-bold">
                      Chat created at {slicedCreatedAt}
                    </span>
                    <Button
                      onClick={async () => {
                        await axios.delete(
                          `http://localhost:3001/chats/${message.id}`,
                        );
                        const updatedMessages = messages.filter(
                          (msg) => msg.id !== message.id,
                        );
                        setMessages(updatedMessages);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                  {message.chat_contents
                    .filter(
                      (chat_content, index) =>
                        !(chat_content.role === 'user' && index === 0),
                    )
                    .map((chat_content) => {
                      const role = chat_content.role;
                      const firstLetterBold = role[0].toUpperCase();
                      const restOfRole = role.slice(1);
                      return (
                        <div key={chat_content.content} className="mt-2">
                          <strong>
                            {firstLetterBold}
                            {restOfRole}
                          </strong>
                          : {chat_content.content}
                        </div>
                      );
                    })}
                </div>
              );
            })
          ) : (
            <div>No chats saved!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
