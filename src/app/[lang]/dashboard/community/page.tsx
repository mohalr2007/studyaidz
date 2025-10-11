
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, MessageSquare, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Database } from '@/types/supabase';

type Student = Database['public']['Tables']['students']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

type PostWithAuthor = Post & {
    students: Pick<Student, 'full_name' | 'username'> | null;
};


export default function CommunityPage() {
    const [posts, setPosts] = useState<PostWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    students(full_name, username)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching posts:", error);
            } else if (data) { 
                setPosts(data as PostWithAuthor[]);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);
    
    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div className="text-center p-10">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">جاري تحميل المنشورات...</p>
            </div>
        );
    }
    
    if (posts.length === 0) {
        return (
             <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">مجتمع الطلاب لم يطلق بعد</h2>
                <p className="text-muted-foreground">هذه الميزة قيد التطوير. عد قريبًا للمشاركة في المناقشات!</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">مجتمع الطلاب</h1>
                <Button disabled>إنشاء منشور جديد</Button>
            </div>
            <div className="space-y-6">
                {posts && posts.map(post => {
                    const authorName = post.students?.full_name || 'مستخدم غير معروف';
                    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ar });

                    return (
                        <Card key={post.id} className="overflow-hidden">
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
                            <CardFooter className="flex justify-between items-center bg-muted/50 p-3">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                                        <ArrowUp className="h-4 w-4" />
                                        <span>{post.upvotes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                                        <ArrowDown className="h-4 w-4" />
                                        <span>{post.downvotes}</span>
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>0 تعليقات</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
