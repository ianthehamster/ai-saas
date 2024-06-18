'use client';

import axios from 'axios';
import * as z from 'zod';
import { Heading } from '@/components/heading';
import { Code } from 'lucide-react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';

import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { useUser } from '@clerk/nextjs';
import { LoaderSaving } from '@/components/loader-saving';

const CodePage = () => {
  const router = useRouter();
  const useUserObject = useUser();

  const [messages, setMessages] = useState([{ role: 'user', content: '' }]);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

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

      console.log('The newMessage is: ', newMessages);

      const response = await axios.post('/api/code', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (err) {
      // To DoL Open Pro Modal
      console.log(err);
    } finally {
      router.refresh();
    }
  };

  const saveChat = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setSaveLoading(true);

    try {
      const email = useUserObject.user?.primaryEmailAddress?.emailAddress;

      const loggedInUser = await axios.get(
        `http://localhost:3001/users/email?email=${email}`,
      );

      if (loggedInUser.data && messages.length > 1) {
        try {
          const savedPost = await axios.post(`http://localhost:3001/chats`, {
            chat_contents: messages,
            user_id: loggedInUser.data.id,
          });

          setTimeout(() => {
            setSaveLoading(false);
          }, 2000);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg
            border
            w-full
            p-4
            px-3
            md:px-6
            focus-within:shadow-sm
            grid
            grid-cols-12
            gap-2
            "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using React hooks"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
              <Button
                type="button"
                className="col-span-6 lg:col-span-2 w-full"
                onClick={saveChat}
              >
                Save Chat
              </Button>
              <Button
                type="button"
                className="col-span-6 lg:col-span-2 w-full"
                onClick={() => {
                  setMessages([{ role: 'user', content: '' }]);
                }}
              >
                Clear Chat
              </Button>
            </form>
          </Form>
        </div>
        {!saveLoading ? (
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}
            {messages.length === 1 && !isLoading && (
              <div>
                <Empty label="No conversation started" />
              </div>
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.length > 1
                ? messages.slice(1).map((message) => (
                    <div
                      key={message.content}
                      className={cn(
                        'p-8 w-full flex items-start gap-x-8 rounded-lg',
                        message.role === 'user'
                          ? 'bg-white border border-black/10'
                          : 'bg-muted',
                      )}
                    >
                      {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                      <ReactMarkdown
                        components={{
                          pre: ({ node, ...props }) => (
                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                              <pre {...props} />
                            </div>
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-black/10 rounded-lg p-1"
                              {...props}
                            />
                          ),
                        }}
                        className="text-sm overflow-hidden leading-7"
                      >
                        {message.content || ''}
                      </ReactMarkdown>{' '}
                    </div>
                  ))
                : null}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <LoaderSaving />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePage;
