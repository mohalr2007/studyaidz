
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
import { User as UserIcon, Mail, Calendar } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { academicData, type AcademicInstitution } from '@/lib/academic-data';
import { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';

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

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    values: {
      full_name: student?.full_name || '',
      date_of_birth: student?.date_of_birth
        ? student.date_of_birth.split('T')[0]
        : '',
      field_of_study: student?.field_of_study || '',
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  useEffect(() => {
    if (student?.field_of_study) {
      for (const inst of [
        ...academicData.universites,
        ...academicData.ecoles,
      ]) {
        if (inst.specializations.includes(student.field_of_study)) {
          setInstitutionType(inst.type);
          setSelectedInstitution(inst.name);
          // Manually trigger specializations update for pre-fill
          const institution = (
            inst.type === 'universite'
              ? academicData.universites
              : academicData.ecoles
          ).find((i) => i.name === inst.name);
          setAvailableSpecializations(
            institution ? institution.specializations : []
          );
          form.setValue('field_of_study', student.field_of_study);
          break;
        }
      }
    }
  }, [student, form]);

  useEffect(() => {
    if (institutionType) {
      const institutions =
        institutionType === 'universite'
          ? academicData.universites
          : academicData.ecoles;
      setAvailableInstitutions(institutions);
      // Don't reset selected institution if it's still valid for the new type
      const currentInst = institutions.find(i => i.name === selectedInstitution);
      if (!currentInst) {
        setSelectedInstitution('');
        setAvailableSpecializations([]);
        form.setValue('field_of_study', '');
      }
    }
  }, [institutionType, form, selectedInstitution]);

  useEffect(() => {
    if (selectedInstitution) {
      const institution = availableInstitutions.find(
        (inst) => inst.name === selectedInstitution
      );
      setAvailableSpecializations(
        institution ? institution.specializations : []
      );
       // Do not reset field_of_study if it's already set and valid
       if (!institution?.specializations.includes(form.getValues('field_of_study'))) {
        form.setValue('field_of_study', '');
       }
    } else {
        setAvailableSpecializations([]);
    }
  }, [selectedInstitution, availableInstitutions, form]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('field_of_study', data.field_of_study);

    const result = await updateStudentProfile(formData);

    if (result?.error) {
      toast({
        title: 'خطأ',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديث ملفك الشخصي.',
      });
    }
  };
  
  const institutionOptions = availableInstitutions.map(inst => ({
      value: inst.name,
      label: `${inst.name} (${inst.abbreviation})`
  }));

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-6"
          >
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

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
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
                name="field_of_study"
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

            <div className="md:col-span-2 flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
