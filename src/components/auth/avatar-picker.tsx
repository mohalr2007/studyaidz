'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

interface AvatarPickerProps {
  onAvatarChange: (url: string | null) => void;
}

export function AvatarPicker({ onAvatarChange }: AvatarPickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();
  const { user } = useUser();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
        toast({
            title: 'Utilisateur non authentifié',
            description: 'Vous devez être connecté pour téléverser une image.',
            variant: 'destructive'
        });
        return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            title: 'الملف كبير جدًا',
            description: 'الرجاء اختيار صورة بحجم أقل من 2 ميغابايت.',
            variant: 'destructive'
        });
        return;
    }

    setIsLoading(true);

    try {
      const filePath = `${user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setPreview(publicUrl);
      onAvatarChange(publicUrl);

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'خطأ في رفع الصورة',
        description: error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
        <div 
            className="relative group w-24 h-24"
            onClick={() => !isLoading && fileInputRef.current?.click()}
        >
            <Avatar className="w-full h-full text-4xl cursor-pointer">
                <AvatarImage src={preview || undefined} alt="Avatar Preview" className="transition-opacity group-hover:opacity-50"/>
                <AvatarFallback>
                    {isLoading ? <Loader2 className="animate-spin" /> : <User />}
                </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 {!isLoading && <Camera className="w-8 h-8 text-white" />}
            </div>
        </div>
         <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, WEBP (max 2MB)
        </p>
    </div>
  );
}
