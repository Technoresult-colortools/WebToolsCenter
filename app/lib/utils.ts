import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // Use clsx to filter and join classes
  const filteredClasses = clsx(inputs);
  // Use twMerge to merge Tailwind classes
  return twMerge(filteredClasses);
}
