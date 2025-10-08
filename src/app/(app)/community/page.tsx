import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp, MessageCircle, PlusCircle } from "lucide-react";
import type { CommunityPost } from "@/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const dummyPosts: CommunityPost[] = [
    {
        id: '1', uid: 'user1', authorName: 'أحمد علي', authorImage: 'https://picsum.photos/seed/user1/40/40',
        title: 'ما هي أفضل طريقة لمراجعة التفاضل والتكامل؟',
        content: 'أجد صعوبة في تذكر جميع القواعد والمفاهيم. هل لدى أحدكم نصائح أو مصادر مفيدة؟ شكراً مقدماً!',
        upvotes: 15, downvotes: 2, createdAt: new Date(Date.now() - 3600 * 1000), commentsCount: 5,
    },
    {
        id: '2', uid: 'user2', authorName: 'فاطمة الزهراء', authorImage: 'https://picsum.photos/seed/user2/40/40',
        title: 'مساعدة في مشروع هياكل البيانات',
        content: 'أبحث عن شريك للعمل على مشروع هياكل البيانات. المشروع حول تطبيق شجرة البحث الثنائية (BST). من مهتم؟',
        upvotes: 8, downvotes: 0, createdAt: new Date(Date.now() - 3600 * 1000 * 5), commentsCount: 2,
    },
    {
        id: '3', uid: 'user3', authorName: 'محمد أمين', authorImage: 'https://picsum.photos/seed/user3/40/40',
        title: 'ملخصات لمادة الشبكات',
        content: 'قمت بتلخيص الفصلين الأول والثاني من مادة الشبكات باستخدام المساعد الذكي هنا. يمكنكم إيجادها في قسم الملخصات.',
        upvotes: 25, downvotes: 1, createdAt: new Date(Date.now() - 3600 * 1000 * 24), commentsCount: 8,
    }
];

const postImage = PlaceHolderImages.find(p => p.id === 'community-post-1');


export default function CommunityPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-3xl">مجتمع الطلاب</CardTitle>
                        <CardDescription>مكان لطرح الأسئلة، مشاركة المعرفة، والتواصل مع زملائك.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="me-2 h-4 w-4" />
                        إنشاء منشور جديد
                    </Button>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {dummyPosts.map(post => (
                        <Card key={post.id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.authorImage} alt={post.authorName} />
                                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{post.authorName}</p>
                                        <p className="text-xs text-muted-foreground">{post.createdAt.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <CardTitle className="pt-4 font-headline">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{post.content}</p>
                                {post.id === '1' && postImage && (
                                     <div className="mt-4 rounded-lg overflow-hidden border">
                                        <Image
                                            src={postImage.imageUrl}
                                            alt={postImage.description}
                                            width={600}
                                            height={400}
                                            className="w-full h-auto object-cover"
                                            data-ai-hint={postImage.imageHint}
                                        />
                                     </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon"><ArrowUp className="h-5 w-5" /></Button>
                                    <span>{post.upvotes - post.downvotes}</span>
                                    <Button variant="ghost" size="icon"><ArrowDown className="h-5 w-5" /></Button>
                                </div>
                                <Button variant="ghost">
                                    <MessageCircle className="me-2 h-5 w-5" />
                                    {post.commentsCount} تعليقات
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>مواضيع شائعة</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-2">
                            <Button variant="link" className="p-0 h-auto">#رياضيات</Button>
                            <Button variant="link" className="p-0 h-auto">#برمجة</Button>
                            <Button variant="link" className="p-0 h-auto">#مشاريع_تخرج</Button>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
