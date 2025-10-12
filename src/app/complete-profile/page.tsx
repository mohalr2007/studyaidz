
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
import { Calendar as CalendarIcon, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { completeUserProfile } from './actions';
import { useFormStatus } from 'react-dom';
import { Logo } from '@/components/logo';
import { useState, useEffect, use } from 'react';
import { academicData, type AcademicInstitution } from '@/lib/academic-data';
import { Combobox } from '@/components/ui/combobox';
import { AvatarPicker } from '@/components/auth/avatar-picker';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Locale } from '@/i18n-config';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'جاري الحفظ...' : 'إكمال التسجيل'}
    </Button>
  );
}

export default function CompleteProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const lang = use(params);
  const [institutionType, setInstitutionType] = useState<
    'universite' | 'ecole' | ''
  >('');
  const [availableInstitutions, setAvailableInstitutions] = useState<
    AcademicInstitution[]
  >([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [availableSpecializations, setAvailableSpecializations] = useState<
    string[]
  >([]);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const { user } = useUser();
  const { toast } = useToast();
  const loginHeroImage = PlaceHolderImages.find((p) => p.id === 'login-hero');

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileFormSchema),
    defaultValues: {
      full_name: '',
      username: '',
      fieldOfStudy: '',
      avatar_url: '',
    },
  });
  
  useEffect(() => {
    if (user?.email) {
      // The schema doesn't have email, but we might need it for display
    }
  }, [user, form]);

  useEffect(() => {
      form.setValue('avatar_url', avatarUrl);
  }, [avatarUrl, form]);


  useEffect(() => {
    if (institutionType) {
      const institutions =
        institutionType === 'universite'
          ? academicData.universites
          : academicData.ecoles;
      setAvailableInstitutions(institutions);
      setSelectedInstitution('');
      setAvailableSpecializations([]);
      form.setValue('fieldOfStudy', '');
    }
  }, [institutionType, form]);

  useEffect(() => {
    if (selectedInstitution) {
      const institution = availableInstitutions.find(
        (inst) => inst.name === selectedInstitution
      );
      setAvailableSpecializations(
        institution ? institution.specializations : []
      );
      form.setValue('fieldOfStudy', '');
    }
  }, [selectedInstitution, availableInstitutions, form]);

  const onSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    const formData = new FormData();
    formData.append('lang', lang);
    formData.append('full_name', data.full_name);
    formData.append('username', data.username);
    formData.append('gender', data.gender);
    formData.append('dateOfBirth', data.dateOfBirth.toISOString());
    formData.append('fieldOfStudy', data.fieldOfStudy);
    formData.append('avatar_url', data.avatar_url || '');

    const result = await completeUserProfile(formData);

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile saved successfully.',
      });
    }
  };
  
  const institutionOptions = availableInstitutions.map(inst => ({
      value: inst.name,
      label: `${inst.name} (${inst.abbreviation})`
  }));

  return (
    <div className="relative min-h-screen w-full">
      {loginHeroImage && (
        <Image
          src={loginHeroImage.imageUrl}
          alt={loginHeroImage.description}
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint={loginHeroImage.imageHint}
        />
      )}
       <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm p-4">
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
                  <div className="space-y-2"> 
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        disabled
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>

                  <FormField
                      control={form.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الصورة الشخصية</FormLabel>
                          <FormControl>
                              <AvatarPicker onAvatarChange={setAvatarUrl} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      <Select
                        onValueChange={(value: 'universite' | 'ecole') =>
                          setInstitutionType(value)
                        }
                        value={institutionType}
                      >
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

                    <FormItem className="flex flex-col">
                      <FormLabel>المؤسسة</FormLabel>
                      <Combobox
                        options={institutionOptions}
                        selectedValue={selectedInstitution}
                        onSelect={setSelectedInstitution}
                        placeholder="اختر المؤسسة"
                        searchPlaceholder="ابحث عن مؤسسة..."
                        notFoundText="لم يتم العثور على المؤسسة."
                        disabled={!institutionType}
                      />
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="fieldOfStudy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>التخصص الدراسي</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedInstitution}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر التخصص" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableSpecializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
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
    </div>
  );
}
