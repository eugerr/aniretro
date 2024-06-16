import { MountainIcon } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='border-t shadow-lg py-6 w-full'>
      <div className='container mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between'>
        <div className='flex items-center gap-2'>
          <MountainIcon className='h-6 w-6 ' />
          <span className=' font-medium'>Anime Streamer</span>
        </div>
        <div className='text-sm'>
          &copy; 2024 Anime Streamer. All rights reserved.
        </div>
        <div className='flex items-center gap-4'>
          <Link href='#' className='hover: transition-colors' prefetch={false}>
            Privacy Policy
          </Link>
          <Link href='#' className='hover: transition-colors' prefetch={false}>
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
