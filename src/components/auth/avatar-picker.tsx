'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';

const PRESET_AVATARS = [
  '/avatars/01.png',
  '/avatars/02.png',
  '/avatars/03.png',
  '/avatars/04.png',
  '/avatars/05.png',
  '/avatars/06.png',
];

interface AvatarPickerProps {
  onAvatarChange: (url: string | null) => void;
}

export function AvatarPicker({ onAvatarChange }: AvatarPickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();
  const { user } = useUser(); // Get the currently authenticated user

  const handlePresetSelect = (avatarPath: string) => {
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars${avatarPath}`;
    setPreview(publicUrl);
    onAvatarChange(publicUrl);
  };

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
      // Corrected file path for policy compliance
      const filePath = `${user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            upsert: true, // This will overwrite the file if it already exists
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
      <Avatar className="w-24 h-24 text-4xl">
        <AvatarImage src={preview || undefined} alt="Avatar Preview" />
        <AvatarFallback>
            {isLoading ? <Loader2 className="animate-spin" /> : <User />}
        </AvatarFallback>
      </Avatar>

      <Tabs defaultValue="presets" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">اختر رمزًا</TabsTrigger>
          <TabsTrigger value="upload">ارفع صورة</TabsTrigger>
        </TabsList>
        <TabsContent value="presets">
            <div className="p-4 grid grid-cols-3 gap-4">
                {PRESET_AVATARS.map(avatar => (
                    <button key={avatar} type="button" onClick={() => handlePresetSelect(avatar)} className="rounded-full overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none">
                        <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars${avatar}`} alt={`Avatar ${avatar}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="upload">
          <div className="p-4 flex flex-col items-center justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || !user}
            >
              <Upload className="me-2" />
              اختر ملفًا
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              disabled={isLoading || !user}
            />
            <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, WEBP (بحد أقصى 2 ميغابايت)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
