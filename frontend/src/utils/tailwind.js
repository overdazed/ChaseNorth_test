import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes with clsx and twMerge
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper to use Tailwind classes in styled-components
export const tw = (strings, ...values) => {
  const classNames = String.raw(strings, ...values);
  return twMerge(classNames);
};
