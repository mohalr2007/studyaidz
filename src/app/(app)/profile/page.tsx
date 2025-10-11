// Added by AI - Profile page

import { createClient } from '@/lib/supabase/server';
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
import { User, Mail, Calendar, BookOpen } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: student } = await supabase.from('students').select('*').eq('id', user?.id || '').single();

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الملف الشخصي</CardTitle>
        <CardDescription>
          عرض وتحديث معلوماتك الشخصية.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.user_metadata.avatar_url} alt={student?.username || ''} />
            <AvatarFallback className="text-3xl">
              {getInitials(student?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
             <h2 className="text-2xl font-bold">{student?.full_name}</h2>
             <p className="text-muted-foreground">@{student?.username}</p>
          </div>
        </div>

        <form className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="fullName" defaultValue={student?.full_name || ''} className="pl-10" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue={user?.email || ''} readOnly disabled className="pl-10" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="dob">تاريخ الميلاد</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="dob" defaultValue={student?.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('ar-DZ') : ''} className="pl-10" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">التخصص الدراسي</Label>
                <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="fieldOfStudy" defaultValue={student?.field_of_study || ''} className="pl-10" />
                </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
                <Button>حفظ التغييرات</Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}