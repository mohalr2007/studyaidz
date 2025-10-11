

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    const supabase = createClient();
    
    // Fetch posts and join with student data to get author info
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:students(full_name, username)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        // Handle error display if necessary
    }
    
    // Fetch user avatars (in a real app, this might be stored with the user profile)
    // For now, we'll generate initials.
    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">مجتمع الطلاب</h1>
                <Button>إنشاء منشور جديد</Button>
            </div>
            <div className="space-y-6">
                {posts && posts.map(post => {
                    const authorName = post.author?.full_name || 'مستخدم غير معروف';
                    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ar });

                    return (
                        <Card key={post.id} className="overflow-hidden">
                            {/* In a real app, post images would be stored and retrieved */}
                            {/* <div className="w-full h-48 relative">
                                <Image src={"/placeholder.svg"} alt={"Post image"} layout="fill" objectFit="cover" />
                            </div> */}
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={''} />
                                        <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{authorName}</p>
                                        <p className="text-xs text-muted-foreground">{timeAgo}</p>
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
                                    {/* In a real app, you would fetch comments count */}
                                    <span>0 تعليقات</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
                {(!posts || posts.length === 0) && (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">لا توجد منشورات حتى الآن. كن أول من ينشر!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
