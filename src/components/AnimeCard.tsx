import { Anime } from '@/types'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'
import Image from 'next/image'
import { formatTitle } from '@/lib/utils'
import Link from 'next/link'

export default function AnimeCard({ data }: { data: Anime }) {
  return (
    <Link href={`/details?id=${data.id}`}>
      <Card className='aspect-[9/12] group relative rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105 cursor-pointer'>
        <div className='relative h-5/6'>
          <Image
            src={data.image}
            className='object-cover object-top'
            fill
            alt={formatTitle(data.title) + ' image'}
          />
        </div>
        <h3 className='px-1 text-xs md:text-base line-clamp-1'>
          {formatTitle(data.title)}
        </h3>
      </Card>
    </Link>
  )
}

export function AnimeCardSkeleton() {
  return (
    <Card className='aspect-[9/12]'>
      <Skeleton className='h-full w-full' />
    </Card>
  )
}
