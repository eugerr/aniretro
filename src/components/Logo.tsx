import { siteConfig } from '@/config/site'
import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href='/' className='flex items-center gap-1 font-bold'>
      <Image
        className='rounded-full'
        src='/icon-256x256.png'
        width={40}
        height={40}
        alt='Logo'
      />
      <span>{siteConfig.name}</span>
    </Link>
  )
}
