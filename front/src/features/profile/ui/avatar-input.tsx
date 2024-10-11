'use client';
import UserAvatar from '@/shared/ui/user-avatar';
import { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { ProfileFormFields } from '../model/profile-form.schema';

interface Props {
  form: UseFormReturn<ProfileFormFields>;
  avatarUrl?: string | null;
}
export default function AvatarInput({ avatarUrl, form }: Props) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      form.setValue('avatar', file);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="relative group cursor-pointer p-0 aspect-square sm:size-24 size-32"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Нажмите, чтобы загрузить новую аватарку"
            >
              <UserAvatar
                src={avatarPreview || avatarUrl}
                className="size-full"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Поменять аватарку</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <input
        data-testid="avatar-input"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={handleAvatarChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
