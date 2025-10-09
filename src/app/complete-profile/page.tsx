
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  AtSign,
  Cake,
  Book,
  Check,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { completeUserProfile } from '@/app/actions/user';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { UserProfileFormData, UserProfileFormSchema } from '@/types';
import AuthGuard from '@/components/auth/auth-guard';


export default function CompleteProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, firebaseUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileFormSchema),
    defaultValues: {
      name: user?.name || '',
      username: '',
      gender: undefined,
      dateOfBirth: undefined,
      fieldOfStudy: '',
    },
  });

  const onSubmit = async (data: UserProfileFormData) => {
    if (!firebaseUser) {
      toast({
        title: 'خطأ',
        description: 'يجب أن تكون مسجلاً للدخول لإكمال ملفك الشخصي.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await completeUserProfile(firebaseUser.uid, data);
      toast({
        title: 'اكتمل الملف الشخصي!',
        description: 'شكرًا لك! يتم الآن إعادة توجيهك إلى لوحة التحكم.',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: 'فشل تحديث الملف الشخصي',
        description: 'حدث خطأ أثناء حفظ بياناتك. حاول مرة أخرى.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-950 flex items-center justify-center p-4 transition-all duration-500 animate-in fade-in-50">
        <Card className="w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 bg-gradient-to-r from-primary to-accent text-white p-3 rounded-full w-fit">
                <User size={32} />
            </div>
            <CardTitle className="text-3xl font-headline">أكمل ملفك الشخصي</CardTitle>
            <CardDescription>
              مرحباً بك في StudyAI DZ! نحتاج فقط إلى بعض التفاصيل الإضافية للبدء.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2 relative">
                <Label htmlFor="name">الاسم الكامل</Label>
                <User className="absolute right-3 top-9 text-muted-foreground h-5 w-5" />
                <Input id="name" {...register('name')} placeholder="مثال: أحمد بلقاسم" className="pr-10" />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>

              {/* Username */}
              <div className="space-y-2 relative">
                <Label htmlFor="username">اسم المستخدم</Label>
                <AtSign className="absolute right-3 top-9 text-muted-foreground h-5 w-5" />
                <Input id="username" {...register('username')} placeholder="مثال: ahmed_21" className="pr-10" />
                {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                 <Label>الجنس</Label>
                 <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                             <Label htmlFor="male" className="flex items-center gap-2 cursor-pointer rounded-lg border p-3 flex-1 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                <RadioGroupItem value="male" id="male" />
                                <span className="text-blue-500 font-semibold">ذكر</span>
                             </Label>
                             <Label htmlFor="female" className="flex items-center gap-2 cursor-pointer rounded-lg border p-3 flex-1 has-[:checked]:bg-pink-500/10 has-[:checked]:border-pink-500">
                                <RadioGroupItem value="female" id="female" />
                                <span className="text-pink-500 font-semibold">أنثى</span>
                             </Label>
                        </RadioGroup>
                    )}
                 />
                 {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label>تاريخ الميلاد</Label>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn('w-full justify-start text-right font-normal pr-10', !field.value && 'text-muted-foreground')}
                        >
                          <Cake className="absolute right-3 h-5 w-5" />
                          {field.value ? format(field.value, 'PPP') : <span>اختر تاريخًا</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1980}
                          toYear={new Date().getFullYear() - 10}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.dateOfBirth && <p className="text-destructive text-sm">{errors.dateOfBirth.message}</p>}
              </div>

              {/* Field of Study */}
              <div className="space-y-2 relative">
                <Label htmlFor="fieldOfStudy">التخصص الدراسي</Label>
                <Book className="absolute right-3 top-9 text-muted-foreground h-5 w-5" />
                <Input id="fieldOfStudy" {...register('fieldOfStudy')} placeholder="مثال: إعلام آلي" className="pr-10" />
                {errors.fieldOfStudy && <p className="text-destructive text-sm">{errors.fieldOfStudy.message}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={handleSubmit(onSubmit)} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="me-2 h-4 w-4" />
              )}
              حفظ ومتابعة
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthGuard>
  );
}
