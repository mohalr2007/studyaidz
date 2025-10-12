
'use client';

import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfileFormSchema, type UserProfileFormData } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { completeUserProfile } from './actions';
import { useFormStatus } from 'react-dom';
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';
import { academicData } from '@/lib/academic-data';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'جاري الحفظ...' : 'إكمال التسجيل'}
    </Button>
  );
}

export default function CompleteProfilePage() {

  const [institutionType, setInstitutionType] = useState<'universite' | 'ecole' | ''>('');
  const [availableInstitutions, setAvailableInstitutions] = useState<typeof academicData.universites>([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [availableSpecializations, setAvailableSpecializations] = useState<string[]>([]);
  
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      fieldOfStudy: '',
    },
  });

  useEffect(() => {
    if (institutionType) {
      const institutions = institutionType === 'universite' ? academicData.universites : academicData.ecoles;
      setAvailableInstitutions(institutions);
      setSelectedInstitution('');
      setAvailableSpecializations([]);
      form.setValue('fieldOfStudy', '');
    }
  }, [institutionType, form]);

  useEffect(() => {
    if (selectedInstitution) {
      const institution = availableInstitutions.find(inst => inst.name === selectedInstitution);
      setAvailableSpecializations(institution ? institution.specializations : []);
      form.setValue('fieldOfStudy', '');
    }
  }, [selectedInstitution, availableInstitutions, form]);

  const onSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('username', data.username);
    formData.append('gender', data.gender);
    formData.append('dateOfBirth', data.dateOfBirth.toISOString());
    formData.append('fieldOfStudy', data.fieldOfStudy);

    await completeUserProfile(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle>إكمال ملفك الشخصي</CardTitle>
          <CardDescription>
            نحتاج إلى بعض المعلومات الإضافية قبل أن تتمكن من المتابعة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: أحمد علي" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المستخدم</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: ahmed_ali" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الجنس</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر جنسك" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ الميلاد</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>اختر تاريخًا</span>
                              )}
                              <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() ||
                              date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <FormItem>
                    <FormLabel>نوع المؤسسة</FormLabel>
                    <Select onValueChange={(value: 'universite' | 'ecole') => setInstitutionType(value)} value={institutionType}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="universite">جامعة</SelectItem>
                            <SelectItem value="ecole">مدرسة عليا</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>

                 <FormItem>
                    <FormLabel>المؤسسة</FormLabel>
                    <Select onValueChange={setSelectedInstitution} value={selectedInstitution} disabled={!institutionType}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر المؤسسة" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {availableInstitutions.map(inst => (
                                <SelectItem key={inst.name} value={inst.name}>{inst.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>

                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التخصص الدراسي</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedInstitution}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {availableSpecializations.map(spec => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>


              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    