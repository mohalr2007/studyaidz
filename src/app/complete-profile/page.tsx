
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { updateProfile } from "./actions"
import { Logo } from "@/components/logo"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


// In a real app, this list would be more comprehensive
const algerianSpecializations = [
    "Informatique",
    "Médecine",
    "Pharmacie",
    "Génie Civil",
    "Architecture",
    "Génie Mécanique",
    "Génie Électrique",
    "Sciences Économiques",
    "Droit",
]

const profileFormSchema = z.object({
  full_name: z.string().min(3, { message: "الاسم الكامل مطلوب." }),
  username: z.string().min(3, { message: "اسم المستخدم مطلوب." }).regex(/^[a-zA-Z0-9_]+$/, "يمكن أن يحتوي اسم المستخدم على حروف وأرقام وشرطات سفلية فقط."),
  gender: z.enum(["male", "female"], {
    required_error: "يرجى تحديد الجنس.",
  }),
  date_of_birth: z.date({
    required_error: "تاريخ الميلاد مطلوب.",
  }),
  field_of_study: z.string({
    required_error: "يرجى اختيار تخصصك الدراسي.",
  }),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>


export default function CompleteProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    throw error;
                }
                setUser(data.user);
            } catch (e: any) {
                setError("Temporary issue fetching your data, please try again.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [supabase]);


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
    })

    async function onSubmit(data: ProfileFormValues) {
        const formData = new FormData()
        formData.append('full_name', data.full_name)
        formData.append('username', data.username)
        formData.append('gender', data.gender)
        formData.append('date_of_birth', data.date_of_birth.toISOString())
        formData.append('field_of_study', data.field_of_study)
        
        await updateProfile(formData)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                 <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                 </Card>
            </div>
        )
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
             <Card className="w-full max-w-lg shadow-2xl">
                <CardHeader className="text-center">
                    <Logo className="justify-center" />
                    <CardTitle className="text-3xl font-bold font-headline">
                        {user ? "User Profile" : "خطوة أخيرة!"}
                    </CardTitle>
                    <CardDescription>
                        {user ? "Here is your information from Supabase." : "نحتاج بعض المعلومات الإضافية لإعداد حسابك."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {user && (
                        <div className="mb-8 flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || 'User'}/>
                                <AvatarFallback>{(user.user_metadata.full_name || user.email || 'U').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <p className="text-xl font-semibold">{user.user_metadata.full_name || 'Name not provided'}</p>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>الاسم الكامل</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: محمد أمين" {...field} />
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
                                        <Input placeholder="اختر اسم مستخدم فريد" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        سيظهر هذا الاسم لزملائك في المجتمع.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>الجنس</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                name="field_of_study"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>التخصص الدراسي</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر تخصصك الجامعي" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {algerianSpecializations.map(spec => (
                                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="date_of_birth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>تاريخ الميلاد</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>اختر تاريخ ميلادك</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1950-01-01")
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">حفظ ومتابعة إلى لوحة التحكم</Button>
                        </form>
                    </Form>
                </CardContent>
             </Card>
        </div>
    )
}

    