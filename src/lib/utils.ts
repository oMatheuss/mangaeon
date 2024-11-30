import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileExtension(mimeType: string) {
  const _mime = mimeType.toLowerCase();
  if (_mime.includes('jpg') || _mime.includes('jpeg')) {
    return 'jpg';
  } else if (_mime.includes('png')) {
    return 'pnj';
  } else if (_mime.includes('webp')) {
    return 'webp';
  } else if (_mime.includes('avif')) {
    return 'avif';
  } else {
    return '';
  }
}
