import {
  FileAudio,
  FileCode,
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
} from 'lucide-react';

export const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const iconForMime = (mime: string) => {
  if (mime.startsWith('image/')) return FileImage;
  if (mime.startsWith('video/')) return FileVideo;
  if (mime.startsWith('audio/')) return FileAudio;
  if (mime.startsWith('text/') || mime === 'application/json' || mime.includes('javascript'))
    return FileCode;
  if (mime === 'application/pdf' || mime.includes('document')) return FileText;
  return FileIcon;
};
