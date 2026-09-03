import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating: number) {
  return rating.toFixed(1)
}

export function normalizeRating(rating: number) {
  return Math.round(Math.min(5, Math.max(0, rating)) * 10) / 10
}
