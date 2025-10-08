"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizePdfContent } from '@/ai/flows/summarize-pdf-content';
import { generateMindMap } from '@/ai/flows/generate-ai-mind-maps';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, FileText, BrainCircuit } from 'lucide-react';
import MindMap from './mind-map';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

const FormSchema = z.object({
  pdfFile: z
    .any()
    .refine((files) => files?.length == 1, 'يجب اختيار ملف PDF.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `حجم الملف يجب أن لا يتجاوز 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      'يجب أن يكون الملف من نوع PDF.'
    ),
});

type FormValues = z.infer<typeof FormSchema>;

export default function Summarizer() {
  const [summary, setSummary] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<any>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSummarizeSubmit = async (data: FormValues) => {
    setIsSummarizing(true);
    setSummary(null);
    setMindMapData(null);
    try {
      const dataUri = await fileToDataUri(data.pdfFile[0]);
      const result = await summarizePdfContent({ pdfDataUri: dataUri });
      setSummary(result.summary);
      toast({ title: 'تم التلخيص بنجاح' });
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      toast({ title: 'خطأ في التلخيص', description: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.', variant: 'destructive' });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateMindMap = async () => {
    if (!summary) return;
    setIsGeneratingMap(true);
    setMindMapData(null);
    try {
      const result = await generateMindMap({ text: summary });
      setMindMapData(JSON.parse(result.mindMapData));
      toast({ title: 'تم إنشاء الخريطة الذهنية' });
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast({ title: 'خطأ في إنشاء الخريطة', description: 'تأكد من أن النص يحتوي على مفاهيم قابلة للتحويل.', variant: 'destructive' });
    } finally {
      setIsGeneratingMap(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. رفع ملف PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSummarizeSubmit)} className="space-y-4">
            <Input id="pdfFile" type="file" accept="application/pdf" {...register('pdfFile')} />
            {errors.pdfFile && <p className="text-sm text-destructive">{errors.pdfFile.message as string}</p>}
            <Button type="submit" disabled={isSummarizing}>
              {isSummarizing ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="me-2 h-4 w-4" />
              )}
              تلخيص الملف
            </Button>
          </form>
        </CardContent>
      </Card>

      {isSummarizing && (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>2. الملخص</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
            <Button onClick={handleGenerateMindMap} disabled={isGeneratingMap}>
              {isGeneratingMap ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="me-2 h-4 w-4" />
              )}
              توليد خريطة ذهنية
            </Button>
          </CardContent>
        </Card>
      )}

      {isGeneratingMap && (
        <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
      )}

      {mindMapData && (
        <Card>
          <CardHeader>
            <CardTitle>3. الخريطة الذهنية</CardTitle>
          </CardHeader>
          <CardContent>
            <MindMap data={mindMapData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
