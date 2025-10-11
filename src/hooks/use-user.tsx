
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type Student = Database['public']['Tables']['students']['Row'];

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: studentData } = await supabase
          .from('students')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setStudent(studentData);
      }
      setLoading(false);
    };

    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const { data: studentData } = await supabase
            .from('students')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          setStudent(studentData);
        } else {
          setStudent(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, student, loading };
}
