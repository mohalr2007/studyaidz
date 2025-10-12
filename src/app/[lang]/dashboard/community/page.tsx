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
import { Skeleton } from '@/components/ui/skeleton';

type Student = Database['public']['Tables']['students']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

type PostWithAuthor = Post & {
    students: Pick<Student, 'full_name' | 'username' | 'avatar_url'> | null;
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
                    students(full_name, username, avatar_url)
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
            <div className="container mx-auto p-4 max-w-3xl space-y-6">
                 <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className='space-y-2'>
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-3">
                            <div className="flex justify-between w-full">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }
    
    if (posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">مجتمع الطلاب لم يطلق بعد</h2>
                    <p className="text-muted-foreground">هذه الميزة قيد التطوير. عد قريبًا للمشاركة في المناقشات!</p>
                </div>
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
                    const authorAvatar = post.students?.avatar_url;
                    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ar });

                    return (
                        <Card key={post.id} className="overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={authorAvatar || ''} />
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
