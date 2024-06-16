import { Title } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format title in case its an object or a string
export function formatTitle(anime: Title) {
  if (anime && anime.english) {
    return anime.english
  } else if (anime && anime.romaji) {
    return anime.romaji
  } else if (anime && anime.english) {
    return anime.english
  } else {
    return 'Title Not Available'
  }
}

// Remove html tags from string
export function RemoveHTMLTags(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}
