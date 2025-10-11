
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, Calendar, BookOpen } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormStatus } from 'react-dom';
import { updateStudentProfile } from './actions';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { UserNav } from '@/components/layout/user-nav';

const ProfileFormSchema = z.object({
  full_name: z.string().min(3, 'الاسم الكامل مطلوب.'),
  date_of_birth: z.string().min(1, 'تاريخ الميلاد مطلوب.'),
  field_of_study: z.string().min(2, 'التخصص الدراسي مطلوب.'),
});

type ProfileFormData = z.infer<typeof ProfileFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
    </Button>
  );
}

export default function ProfilePage() {
  const { user, student, loading } = useUser();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    values: { // Use values to dynamically update form
        full_name: student?.full_name || '',
        date_of_birth: student?.date_of_birth ? student.date_of_birth.split('T')[0] : '', // Format for date input
        field_of_study: student?.field_of_study || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('field_of_study', data.field_of_study);
    
    const result = await updateStudentProfile(formData);

    if (result?.error) {
        toast({
            title: "خطأ",
            description: result.error,
            variant: "destructive"
        });
    } else {
        toast({
            title: "تم بنجاح",
            description: "تم تحديث ملفك الشخصي.",
        });
    }
  };


  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  if (loading) {
      return <div>جاري تحميل الملف الشخصي...</div>
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar userNav={<UserNav />} />
      <div className="flex-1 flex flex-col bg-muted/40">
        <AppHeader />
        <main className="p-4 sm:p-6">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>عرض وتحديث معلوماتك الشخصية.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.user_metadata.avatar_url}
                    alt={student?.username || ''}
                  />
                  <AvatarFallback className="text-3xl">
                    {getInitials(student?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{student?.full_name}</h2>
                  <p className="text-muted-foreground">@{student?.username}</p>
                </div>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email || ''}
                        readOnly
                        disabled
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ الميلاد</FormLabel>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="date" {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="field_of_study"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التخصص الدراسي</FormLabel>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2 flex justify-end">
                    <SubmitButton />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
