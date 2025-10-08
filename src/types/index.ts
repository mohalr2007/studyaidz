export type User = {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  role: 'student' | 'admin';
  verified: boolean;
};

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
