
// AI FIX: Converted to a client component to safely handle data fetching and user interactions.
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

// AI FIX: Use types generated from the database schema for consistency.
type Student = Database['public']['Tables']['students']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

// AI FIX: Correctly type the relationship. The query returns a `students` object, not an `author` object.
type PostWithAuthor = Post & {
    students: Pick<Student, 'full_name' | 'username'> | null;
};


export default function CommunityPage() {
    const [posts, setPosts] = useState<PostWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const supabase = createClient();
            // AI FIX: Corrected the select query to use the standard foreign key join syntax.
            // This tells Supabase to fetch related data from the 'students' table via the 'author_id' foreign key.
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    students(full_name, username)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching posts:", error);
            } else if (data) { // AI FIX: Ensure data is not null before setting state.
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
            <div className="container mx-auto p-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">جاري تحميل المنشورات...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">مجتمع الطلاب</h1>
                <Button>إنشاء منشور جديد</Button>
            </div>
            <div className="space-y-6">
                {posts && posts.map(post => {
                    // AI FIX: Access the nested author data from the 'students' object, which matches the query.
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
