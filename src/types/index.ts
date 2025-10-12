
import { z } from 'zod';

export type User = {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  role: 'student' | 'admin';
  verified: boolean;
  isProfileComplete?: boolean;
  username?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: Date;
  fieldOfStudy?: string;
};

export const UserProfileFormSchema = z.object({
    full_name: z.string().min(3, "الاسم الكامل مطلوب."),
    username: z.string().min(3, "اسم المستخدم مطلوب.").regex(/^[a-zA-Z0-9_]+$/, "يمكن أن يحتوي اسم المستخدم على حروف وأرقام وشرطات سفلية فقط."),
    gender: z.enum(["male", "female"], { required_error: "يرجى تحديد الجنس." }),
    dateOfBirth: z.date({ required_error: "تاريخ الميلاد مطلوب." }),
    fieldOfStudy: z.string().min(2, "التخصص الدراسي مطلوب."),
    avatar_url: z.string().url("يجب أن يكون رابط الصورة صحيحًا.").optional().or(z.literal('')),
});

export type UserProfileFormData = z.infer<typeof UserProfileFormSchema>;


export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Quiz = {
  id: string;
  subject: string;
  questions: QuizQuestion[];
  createdAt: Date;
};

export type CommunityPost = {
  id: string;
  uid: string;
  authorName: string;
  authorImage: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  commentsCount: number;
};
