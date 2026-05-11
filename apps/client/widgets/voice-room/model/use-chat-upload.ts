'use client';

import { notifications } from '@mantine/notifications';
import { useState } from 'react';

import { supabase } from '@/shared/api';

type Sender = ((payload: string) => Promise<unknown> | unknown) | undefined;

const BUCKET = 'chat-files';

export const useChatUpload = (send: Sender) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File | null) => {
    if (!file || !send) return;
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
      const { data, error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      await send(
        JSON.stringify({
          type: 'file',
          url: publicUrl,
          name: file.name,
          size: file.size,
          mime: file.type || 'application/octet-stream',
        }),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      notifications.show({ color: 'red', title: 'Upload failed', message });
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
