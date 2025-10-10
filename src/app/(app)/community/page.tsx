
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { createClient } from "@/lib/supabase/server";

export default async function CommunityPage() {
    const supabase = createClient();
    // In a real app, you would fetch posts from the database
    // For now, we use placeholder data
    const posts = [
        { id: 1, author: "أحمد علي", avatar: "", title: "كيف يمكنني التحضير لامتحان البكالوريا في الفيزياء؟", content: "أبحث عن نصائح واستراتيجيات فعالة لمراجعة مادة الفيزياء. ما هي أهم الفصول التي يجب التركيز عليها؟", upvotes: 12, downvotes: 1, comments: 5, imageId: "community-post-1" },
        { id: 2, author: "فاطمة الزهراء", avatar: "", title: "نقاش حول أفضل طرق تلخيص الدروس", content: "أجد صعوبة في تلخيص الدروس الطويلة. هل تفضلون الخرائط الذهنية أم الملخصات المكتوبة؟ شاركونا طرقكم!", upvotes: 25, downvotes: 2, comments: 10, imageId: "community-post-2" },
        { id: 3, author: "محمد أمين", avatar: "", title: "مساعدة في حل هذه المسألة في الرياضيات", content: "مرحبًا جميعًا، واجهتني صعوبة في حل هذه المسأFلة في وحدة الأعداد المركبة. يمكنكم إلقاء نظرة؟", upvotes: 8, downvotes: 0, comments: 3, imageId: "community-post-3" },
    ];
    const getImage = (id: string) => PlaceHolderImages.find(p => p.id === id);


  return (
    <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">مجتمع الطلاب</h1>
            <Button>إنشاء منشور جديد</Button>
        </div>
        <div className="space-y-6">
            {posts.map(post => {
                const image = getImage(post.imageId);
                return (
                    <Card key={post.id} className="overflow-hidden">
                        {image && (
                            <div className="w-full h-48 relative">
                                <Image src={image.imageUrl} alt={image.description} layout="fill" objectFit="cover" data-ai-hint={image.imageHint} />
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={post.avatar} />
                                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">منذ 2 ساعة</p>
                                </div>
                            </div>
                            <CardTitle className="pt-4">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                            <div className="flex gap-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <ArrowUp className="h-4 w-4" />
                                    <span>{post.upvotes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <ArrowDown className="h-4 w-4" />
                                    <span>{post.downvotes}</span>
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments} تعليقات</span>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    </div>
  );
}
