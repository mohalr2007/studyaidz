
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { answerQuestionWithAIChatbot } from '@/ai/flows/answer-questions-with-ai-chatbot';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, Sparkles, User, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';


const FormSchema = z.object({
  question: z.string().min(1, 'لا يمكن إرسال سؤال فارغ.'),
});

type FormValues = z.infer<typeof FormSchema>;

interface Message {
  text: string;
  isUser: boolean;
  fileName?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, student } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll just show a toast.
      // In the future, you would handle the file upload here.
      toast({
        title: "تم تحديد الملف",
        description: `اسم الملف: ${file.name}`,
      });
      // Here you would typically upload the file and get a URL,
      // then include that information in the message to the AI.
    }
    // Reset file input to allow selecting the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { text: data.question, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    reset();

    try {
      const result = await answerQuestionWithAIChatbot({ question: data.question });
      const aiMessage: Message = { text: result.answer, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error with AI chatbot:', error);
      const errorMessage: Message = { text: 'عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى.', isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full flex flex-col max-h-[calc(100vh-8rem)]">
      <CardHeader>
        <CardTitle className="font-headline">المساعد الذكي</CardTitle>
        <CardDescription>اطرح أي سؤال أو حمّل ملفًا للحصول على مساعدة فورية.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
             <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="bg-muted rounded-lg p-3 text-sm rounded-bl-none">
                    <p>مرحباً! أنا مساعدك الدراسي. كيف يمكنني مساعدتك اليوم؟</p>
                </div>
              </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', message.isUser ? 'justify-end' : 'justify-start')}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm',
                    message.isUser
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.isUser && (
                   <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(student?.full_name)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center gap-2 pt-4 border-t">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Joindre un fichier</span>
          </Button>
          <Input
            {...register('question')}
            placeholder="اكتب سؤالك هنا..."
            autoComplete="off"
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {errors.question && <p className="text-sm text-destructive">{errors.question.message as string}</p>}
      </CardContent>
    </Card>
  );
}
