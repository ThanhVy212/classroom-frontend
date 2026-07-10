import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTeacherPlaceholderUrl(teacherName: string) {
  const teachersInitials =
      teacherName
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join('');

  return `https://placehold.co/600x400?text=${encodeURIComponent(teachersInitials || 'NA')}`;
}