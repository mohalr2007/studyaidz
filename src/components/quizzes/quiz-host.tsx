"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuizFromSubject } from '@/ai/flows/generate-quiz-from-subject';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Book, Check, X, Clock } from 'lucide-react';
import type { QuizQuestion } from '@/types';
import { cn } from '@/lib/utils';

// Schemas
const SubjectSchema = z.object({
  subject: z.string().min(2, 'يجب أن يكون اسم المادة حرفين على الأقل.'),
  questionCount: z.coerce.number().min(1, 'الحد الأدنى سؤال واحد.').max(10, 'الحد الأقصى 10 أسئلة.'),
});
type SubjectFormValues = z.infer<typeof SubjectSchema>;

// Constants
const QUESTION_TIME_LIMIT = 30; // seconds

export default function QuizHost() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<SubjectFormValues>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: { questionCount: 5 }
  });

  const startQuiz = async (data: SubjectFormValues) => {
    setIsLoading(true);
    setQuiz(null);
    setIsFinished(false);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    try {
      const result = await generateQuizFromSubject({
        subject: data.subject,
        numberOfQuestions: data.questionCount,
      });
      if (result.quiz.length === 0) {
        toast({ title: 'خطأ', description: 'لم يتمكن الذكاء الاصطناعي من إنشاء اختبار لهذه المادة.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }
      setQuiz(result.quiz);
      setSelectedAnswers(new Array(result.quiz.length).fill(null));
    } catch (error) {
      toast({ title: 'خطأ في إنشاء الاختبار', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz!.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.reduce((score, question, index) => {
      return selectedAnswers[index] === question.answer ? score + 1 : score;
    }, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري إنشاء الاختبار، قد يستغرق هذا بعض الوقت...</p>
        </CardContent>
      </Card>
    );
  }

  if (isFinished && quiz) {
    const score = calculateScore();
    const total = quiz.length;
    return (
      <Card>
        <CardHeader>
          <CardTitle>النتيجة النهائية</CardTitle>
          <CardDescription>لقد حصلت على {score} من {total}!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.map((q, i) => (
            <div key={i} className={cn("p-4 rounded-lg border", selectedAnswers[i] === q.answer ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
              <p className="font-bold mb-2">{i + 1}. {q.question}</p>
              <p>إجابتك: {selectedAnswers[i] || "لم تجب"}</p>
              <p className="text-green-700 dark:text-green-400">الإجابة الصحيحة: {q.answer}</p>
            </div>
          ))}
          <Button onClick={() => { setQuiz(null); setIsFinished(false); }}>ابدأ اختبارًا جديدًا</Button>
        </CardContent>
      </Card>
    );
  }

  if (quiz) {
    const question = quiz[currentQuestionIndex];
    return (
        <Card>
            <CardHeader>
                <Progress value={((currentQuestionIndex + 1) / quiz.length) * 100} className="mb-4" />
                <CardTitle>السؤال {currentQuestionIndex + 1} من {quiz.length}</CardTitle>
                <CardDescription className="text-lg font-semibold pt-2">{question.question}</CardDescription>
            </CardHeader>
            <CardContent>
                 <RadioGroup onValueChange={handleAnswerSelect} value={selectedAnswers[currentQuestionIndex] || ''} className="space-y-4">
                    {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="text-base flex-1">{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
                <Button onClick={handleNextQuestion} className="mt-8 w-full" disabled={!selectedAnswers[currentQuestionIndex]}>
                    {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الاختبار</CardTitle>
        <CardDescription>اختر المادة وعدد الأسئلة لبدء الاختبار.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(startQuiz)} className="space-y-4">
          <div>
            <Label htmlFor="subject">المادة</Label>
            <Input id="subject" placeholder="مثال: الرياضيات، الفيزياء..." {...register('subject')} />
            {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="questionCount">عدد الأسئلة (1-10)</Label>
            <Input id="questionCount" type="number" min="1" max="10" {...register('questionCount')} />
            {errors.questionCount && <p className="text-sm text-destructive mt-1">{errors.questionCount.message}</p>}
          </div>
          <Button type="submit">
            <Book className="me-2 h-4 w-4" />
            ابدأ الاختبار
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
