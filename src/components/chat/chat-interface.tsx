
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { answerQuestionWithAIChatbot } from '@/ai/flows/answer-questions-with-ai-chatbot';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, Sparkles, User, Paperclip, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

const FormSchema = z.object({
  question: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  file?: {
    name: string;
    type: string;
  };
}

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });


export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, student } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { question: '' }
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div:first-child');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: "الملف كبير جدًا", description: "الرجاء اختيار ملف بحجم أقل من 5 ميغابايت.", variant: "destructive" });
            return;
        }
        setAttachedFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const submitQuestion = async (questionText: string, file?: File) => {
    // If there's a file but no question, create a default question.
    const questionForApi = (file && !questionText.trim()) 
      ? "Analyse ce fichier" 
      : questionText;
      
    if (!questionForApi.trim() && !file) {
        toast({ description: "لا يمكن إرسال رسالة فارغة.", variant: "destructive" });
        return;
    }
    
    setIsLoading(true);
    const userMessage: Message = { 
        id: Date.now(), 
        text: questionText,  // Display the original text, which might be empty
        isUser: true, 
        file: file ? { name: file.name, type: file.type } : undefined
    };
    setMessages((prev) => [...prev, userMessage]);
    reset();
    setAttachedFile(null);

    try {
      const fileDataUri = file ? await fileToDataUri(file) : undefined;
      const userIdForApi = user?.id || "guest_user";
      
      const result = await answerQuestionWithAIChatbot({ 
        question: questionForApi, // Use the potentially modified question for the API
        userId: userIdForApi,
        fileDataUri 
      });

      const aiMessage: Message = { id: Date.now() + 1, text: result.answer, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error with AI chatbot:', error);
      const errorMessage: Message = { id: Date.now() + 1, text: 'عذرًا, حدث خطأ ما. يرجى المحاولة مرة أخرى.', isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    submitQuestion(data.question, attachedFile || undefined);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
      setValue('question', suggestion);
      submitQuestion(suggestion);
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'GU'; // Guest User
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-8rem)] bg-background rounded-lg border">
      <header className="p-4 border-b">
          <h1 className="text-xl font-bold font-headline flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5"/>
            <span>المساعد الذكي</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">اطرح أي سؤال أو حمّل ملفًا للحصول على مساعدة فورية.</p>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6 h-full">
          <AnimatePresence initial={false}>
            {messages.length === 0 && !isLoading && (
               <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                >
                    <Avatar className="h-16 w-16 mb-4">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Sparkles className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-semibold">كيف يمكنني مساعدتك اليوم؟</h2>
                    <p className="text-muted-foreground mt-2 mb-6">اطرح سؤالك الخاص لبدء المحادثة.</p>
               </motion.div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn('flex items-start gap-3', message.isUser ? 'justify-end' : 'justify-start')}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-xl rounded-lg p-3 text-sm', message.isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                    {message.file && (
                        <div className="mb-2 p-2 bg-black/10 rounded-md flex items-center gap-2">
                            <FileIcon className="h-5 w-5"/>
                            <span className="truncate text-xs font-medium">{message.file.name}</span>
                        </div>
                    )}
                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                </div>
                {message.isUser && (
                   <Avatar className="h-8 w-8">
                    <AvatarImage src={isAuthenticated ? user?.user_metadata.avatar_url : undefined} />
                    <AvatarFallback>{getInitials(isAuthenticated ? student?.full_name : 'Guest User')}</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
             {isLoading && (
              <motion.div layout className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="p-4 pt-0">
        <form onSubmit={handleSubmit(onSubmit)}>
           <fieldset disabled={isLoading} className="group">
                <div className="relative border rounded-lg flex items-center gap-2 focus-within:ring-2 focus-within:ring-ring group-disabled:opacity-50">
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
                        className="shrink-0"
                    >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Joindre un fichier</span>
                    </Button>
                    <div className='flex-1 relative'>
                        {attachedFile && (
                            <div className="absolute bottom-full left-0 mb-2 w-full">
                                <div className="bg-muted p-2 rounded-md flex items-center justify-between text-xs">
                                    <span className="truncate">{attachedFile.name}</span>
                                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => setAttachedFile(null)}>X</Button>
                                </div>
                            </div>
                        )}
                        <Input
                            {...register('question')}
                             placeholder="اكتب سؤالك هنا أو حمّل ملفًا..."
                            autoComplete="off"
                            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
                        />
                    </div>
                    <Button type="submit" size="icon" disabled={!watch('question') && !attachedFile} className="shrink-0 me-2">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </fieldset>
        </form>
      </div>
    </div>
  );
}
    
